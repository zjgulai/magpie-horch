/**
 * Pilot Harness desktop notification module.
 *
 * Subscribes to the DSH mux SSE stream (`/api/events.mux`) and fires a
 * platform notification whenever a top-level agent turn completes or fails.
 * Sub-agent turns (origin === 'subagent') are intentionally suppressed to
 * avoid notification floods during multi-step agentic runs.
 *
 * The subscriber reconnects automatically on network error with exponential
 * back-off capped at 30 s. It is stopped when the Harness process exits or
 * the desktop app is about to quit.
 */

import { request as httpRequest } from 'node:http'
import { Notification } from 'electron'

/** User-visible notification copy. */
const COPY = {
  turnCompleted: { title: 'Pilot Harness', body: '任务已完成' },
  turnFailed: { title: 'Pilot Harness', body: '任务失败' },
} as const

/** Whether the OS supports Electron notifications (always true on macOS / Windows). */
function notificationsSupported(): boolean {
  return Notification.isSupported()
}

function fireNotification(title: string, body: string): void {
  if (!notificationsSupported()) return
  try {
    new Notification({ title, body, silent: false }).show()
  } catch {
    // Notification errors must never crash the main process.
  }
}

// ---------------------------------------------------------------------------
// Settings (read from module-level state so the settings UI can toggle them)
// ---------------------------------------------------------------------------

let notifyOnTurnCompletion = true
let notifyOnTurnFailure = true

export function setNotificationPrefs(prefs: {
  onTurnCompletion?: boolean
  onTurnFailure?: boolean
}): void {
  if (prefs.onTurnCompletion !== undefined) notifyOnTurnCompletion = prefs.onTurnCompletion
  if (prefs.onTurnFailure !== undefined) notifyOnTurnFailure = prefs.onTurnFailure
}

export function getNotificationPrefs(): { onTurnCompletion: boolean; onTurnFailure: boolean } {
  return { onTurnCompletion: notifyOnTurnCompletion, onTurnFailure: notifyOnTurnFailure }
}

// ---------------------------------------------------------------------------
// SSE subscriber
// ---------------------------------------------------------------------------

/** Track which sessions are subagent-originated so we can filter their turns. */
const subagentSessions = new Set<string>()

function handleMuxLine(line: string): void {
  if (!line.startsWith('data:')) return
  const raw = line.slice(5).trim()
  if (!raw || raw === '[DONE]') return

  let frame: unknown
  try { frame = JSON.parse(raw) } catch { return }

  if (frame === null || typeof frame !== 'object') return
  const f = frame as Record<string, unknown>

  // Track subagent sessions (created with origin === 'subagent')
  if (f.type === 'host/session-added') {
    if (f.origin === 'subagent' && typeof f.sessionId === 'string') {
      subagentSessions.add(f.sessionId)
    }
    return
  }

  if (f.type === 'host/session-removed' && typeof f.sessionId === 'string') {
    subagentSessions.delete(f.sessionId)
    return
  }

  // Only handle session/event frames that wrap turn/end
  if (f.type !== 'session/event') return
  const sessionId = f.sessionId as string | undefined
  if (sessionId === undefined) return

  // Suppress subagent turns
  if (subagentSessions.has(sessionId)) return

  const event = f.event as Record<string, unknown> | undefined
  if (event === null || typeof event !== 'object' || event.type !== 'turn/end') return

  const reason = (event.data as Record<string, unknown> | undefined)?.reason
  const kind = (reason as Record<string, unknown> | undefined)?.kind

  if (kind === 'completed' && notifyOnTurnCompletion) {
    fireNotification(COPY.turnCompleted.title, COPY.turnCompleted.body)
  } else if (kind === 'aborted' && notifyOnTurnFailure) {
    fireNotification(COPY.turnFailed.title, COPY.turnFailed.body)
  }
}

// ---------------------------------------------------------------------------
// Reconnecting SSE loop
// ---------------------------------------------------------------------------

let abortController: AbortController | null = null
let stopped = false

const MIN_BACKOFF_MS = 1_000
const MAX_BACKOFF_MS = 30_000

function backoff(attempt: number): number {
  return Math.min(MIN_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS)
}

function openMuxStream(baseUrl: string, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve) => {
    const url = new URL('/api/events.mux', baseUrl)
    const req = httpRequest(
      {
        hostname: url.hostname,
        port: Number(url.port) || 80,
        path: url.pathname + url.search,
        method: 'GET',
        headers: { Accept: 'text/event-stream', 'Cache-Control': 'no-cache' },
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume()
          resolve()
          return
        }

        let buf = ''
        res.setEncoding('utf8')
        res.on('data', (chunk: string) => {
          buf += chunk
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''
          for (const line of lines) handleMuxLine(line.trimEnd())
        })
        res.on('end', resolve)
        res.on('error', () => resolve())

        signal.addEventListener('abort', () => {
          req.destroy()
          resolve()
        }, { once: true })
      },
    )
    req.on('error', () => resolve())
    req.end()
  })
}

/** Start the notification subscriber. Call once after `harnessUrl` is known. */
export function startNotifications(harnessUrl: string): void {
  if (stopped) return
  if (abortController !== null) return // already running

  abortController = new AbortController()
  const { signal } = abortController

  void (async () => {
    let attempt = 0
    while (!stopped && !signal.aborted) {
      await openMuxStream(harnessUrl, signal)
      if (stopped || signal.aborted) break
      // Back off before reconnect
      await new Promise<void>(r => setTimeout(r, backoff(attempt)))
      attempt = Math.min(attempt + 1, 8)
    }
    subagentSessions.clear()
  })()
}

/** Stop the notification subscriber. Call when the Harness process stops or the app quits. */
export function stopNotifications(): void {
  stopped = true
  abortController?.abort()
  abortController = null
  subagentSessions.clear()
}

/** Reset stopped state to allow restarting after a Harness restart. */
export function resetNotifications(): void {
  stopped = false
  abortController = null
}
