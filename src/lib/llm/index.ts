import type { LLMProvider } from './llm-provider';
import type { LLMProviderType } from '@/lib/types';
import { GeminiProvider } from './gemini-provider';
import { DemoLLMProvider } from './demo-llm-provider';

export type { LLMProvider } from './llm-provider';

/**
 * Factory: create the configured LLM provider.
 *
 * Providers:
 *   'gemini' — Google Gemini multimodal API (requires GEMINI_API_KEY)
 *   'demo'   — Deterministic pre-computed answers (no API key needed)
 */
export function createLLMProvider(providerType?: LLMProviderType): LLMProvider {
  const resolved = providerType || (process.env.LLM_PROVIDER as LLMProviderType) || 'demo';

  switch (resolved) {
    case 'gemini':
      return new GeminiProvider();
    case 'demo':
      return new DemoLLMProvider();
    default:
      throw new Error(`Unknown LLM provider: ${resolved}. Use 'gemini' or 'demo'.`);
  }
}

/**
 * Get the current LLM provider label for display.
 */
export function getLLMProviderLabel(): { provider: LLMProviderType; label: string; isDemo: boolean } {
  const provider = (process.env.LLM_PROVIDER as LLMProviderType) || 'demo';

  if (provider === 'gemini') {
    return { provider, label: 'Google Gemini', isDemo: false };
  }
  return { provider, label: 'Demo Mode (pre-computed answers)', isDemo: true };
}
