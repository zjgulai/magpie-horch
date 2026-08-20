/** Client half: optional reminder row in the Workspace Session hover summary. */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { en, NS, zh, type ScheduleSummaryKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap { scheduleSummary: ScheduleSummaryKey }
}

/** Services required by the browser contribution. */
export const inject = ['slots', 'locale', 'connection']

/**
 * Register the locale and optional reminder detail row.
 * @param ctx - Browser plugin context carrying slots and locale services.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-schedule-summary: dictionaries')
  // Adapted for rc.8: sidebar.workspaces.session.detail slot no longer exists
  // TODO: Re-enable when upstream adds this slot back or use conversation.session.header.utilities
  // For now, disable this feature to allow compilation
  // ctx.slots.inject('sidebar.workspaces.session.detail', () => ctx.slots.register({
  //   name: 'sidebar.workspaces.session.detail',
  //   id: 'schedule-summary',
  //   order: 30,
  //   locale: NS,
  //   inject: () => ({
  //     loadSchedule: async (sessionId: string, signal?: AbortSignal): Promise<ScheduleSummary> => {
  //       const result = await connection.rpc.call(
  //         SCHEDULE_SUMMARY_CHANNEL,
  //         SCHEDULE_SUMMARY_GET_ENDPOINT,
  //         { sessionId },
  //         signal,
  //       )
  //       if (!result.ok) throw new Error(result.error.message)
  //       return result.value as ScheduleSummary
  //     },
  //   }),
  // }, ScheduleSessionDetail))
}
