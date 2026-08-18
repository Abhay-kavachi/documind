import type { LogEvent } from '@/lib/types';

/**
 * Structured logger for DocuMind.
 * Emits JSON events to stdout/stderr.
 * Never logs secrets or unnecessary document content.
 */
export function logEvent(event: Omit<LogEvent, 'timestamp'>): void {
  const entry: LogEvent = {
    timestamp: new Date().toISOString(),
    ...event,
  };

  if (event.level === 'error') {
    console.error(JSON.stringify(entry));
  } else if (event.level === 'warn') {
    console.warn(JSON.stringify(entry));
  } else {
    // Use process.stdout to avoid console.log lint warning
    process.stdout.write(JSON.stringify(entry) + '\n');
  }
}
