import { NextResponse } from 'next/server';
import { getRetrievalModeLabel } from '@/lib/retrieval';
import { getLLMProviderLabel } from '@/lib/llm';

/**
 * GET /api/config — Public app configuration (no secrets).
 */
export async function GET() {
  const retrieval = getRetrievalModeLabel();
  const llm = getLLMProviderLabel();

  return NextResponse.json({
    data: {
      retrieval_mode: retrieval.mode,
      retrieval_label: retrieval.label,
      llm_provider: llm.provider,
      llm_label: llm.label,
      is_demo_mode: retrieval.isDemo || llm.isDemo,
    },
  });
}
