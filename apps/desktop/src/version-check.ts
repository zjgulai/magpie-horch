/**
 * Pilot Harness version-check module.
 *
 * Polls the zjgulai/abi_dsh GitHub Releases API for a newer version.
 * When a newer version is found the caller receives the release URL so it
 * can surface a menu item or tray badge.  No download is initiated here.
 *
 * Strategy
 * --------
 * 1. 60 s after app ready → first check.
 * 2. Every 6 hours thereafter.
 * 3. On failure: silent retry on next interval (no crash).
 * 4. Result cached so menu can read it synchronously.
 */

import { request as httpsRequest } from 'node:https'
import { app } from 'electron'

const RELEASES_API =
  'https://api.github.com/repos/zjgulai/abi_dsh/releases/latest'

const INITIAL_DELAY_MS = 60_000        // 1 min after ready
const CHECK_INTERVAL_MS = 6 * 60 * 60_000  // 6 h
const REQUEST_TIMEOUT_MS = 15_000

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface UpdateInfo {
  /** Latest version tag, e.g. "v0.1.1-rc.2-pilot.2" */
  tag: string
  /** Human-readable release name */
  name: string
  /** GitHub release HTML URL */
  url: string
}

let latestUpdate: UpdateInfo | null = null
let onUpdateFound: ((info: UpdateInfo) => void) | null = null

/** Returns the most recently found update, or null if already up-to-date. */
export function getLatestUpdate(): UpdateInfo | null {
  return latestUpdate
}

/** Register a callback invoked once when a new version is found. */
export function onNewVersionFound(cb: (info: UpdateInfo) => void): void {
  onUpdateFound = cb
  // If we already found an update before the listener was registered, call immediately.
  if (latestUpdate !== null) cb(latestUpdate)
}

// ---------------------------------------------------------------------------
// Version comparison
// ---------------------------------------------------------------------------

/**
 * Parse a semver-ish pilot tag like "v0.1.1-rc.2-pilot.2" into a tuple of
 * numbers for numeric comparison.  Falls back to string comparison on parse
 * failure.
 */
function parseTag(tag: string): number[] {
  const clean = tag.replace(/^v/, '')
  // Split on non-numeric boundaries, keep all numeric segments
  const parts = clean.split(/[.\-]/).map(s => parseInt(s, 10)).filter(n => !isNaN(n))
  return parts
}

function isNewer(remote: string, current: string): boolean {
  const r = parseTag(remote)
  const c = parseTag(current)
  const len = Math.max(r.length, c.length)
  for (let i = 0; i < len; i++) {
    const rv = r[i] ?? 0
    const cv = c[i] ?? 0
    if (rv > cv) return true
    if (rv < cv) return false
  }
  return false
}

// ---------------------------------------------------------------------------
// GitHub API fetch
// ---------------------------------------------------------------------------

interface GitHubRelease {
  tag_name: string
  name: string
  html_url: string
  draft: boolean
  prerelease: boolean
}

function fetchLatestRelease(): Promise<GitHubRelease | null> {
  return new Promise((resolve) => {
    const req = httpsRequest(
      RELEASES_API,
      {
        method: 'GET',
        headers: {
          'User-Agent': `Magpie-Horch/${app.getVersion()}`,
          Accept: 'application/vnd.github+json',
        },
        timeout: REQUEST_TIMEOUT_MS,
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume()
          resolve(null)
          return
        }
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk: string) => { body += chunk })
        res.on('end', () => {
          try {
            resolve(JSON.parse(body) as GitHubRelease)
          } catch {
            resolve(null)
          }
        })
        res.on('error', () => resolve(null))
      },
    )
    req.on('error', () => resolve(null))
    req.on('timeout', () => { req.destroy(); resolve(null) })
    req.end()
  })
}

// ---------------------------------------------------------------------------
// Check loop
// ---------------------------------------------------------------------------

async function runCheck(): Promise<void> {
  const release = await fetchLatestRelease()
  if (release === null || release.draft) return

  const current = `v${app.getVersion()}`
  if (!isNewer(release.tag_name, current)) return

  const info: UpdateInfo = {
    tag: release.tag_name,
    name: release.name || release.tag_name,
    url: release.html_url,
  }
  latestUpdate = info
  onUpdateFound?.(info)
}

let intervalHandle: ReturnType<typeof setInterval> | null = null

/** Start background version checks. Call once from app.whenReady(). */
export function startVersionCheck(): void {
  // First check after initial delay
  const initialTimer = setTimeout(() => {
    void runCheck()
    intervalHandle = setInterval(() => { void runCheck() }, CHECK_INTERVAL_MS)
  }, INITIAL_DELAY_MS)
  // Ensure timers do not prevent app quit
  initialTimer.unref()
}

/** Stop version checks (called before app quit). */
export function stopVersionCheck(): void {
  if (intervalHandle !== null) {
    clearInterval(intervalHandle)
    intervalHandle = null
  }
}
