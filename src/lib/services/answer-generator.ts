import { createRetriever } from '@/lib/retrieval';
import { createLLMProvider } from '@/lib/llm';
import { citationService } from './citation-service';
import { conversationService } from './conversation-service';
import { documentService } from './document-service';
import { logEvent } from '@/lib/logger';

/**
 * AnswerGenerator — orchestrates the full QA pipeline:
 * question → retrieval → LLM → citation validation → persistence
 */
export const answerGenerator = {
  async generateAnswer(question: string, documentId: string, ownerId: string) {
    const startTime = Date.now();

    try {
      const doc = documentService.getDocument(documentId);
      if (!doc) {
        throw new Error('Document not found');
      }

      if (doc.status !== 'ready') {
        throw new Error(`Document is not ready (status: ${doc.status})`);
      }

      // Step 1: Retrieve relevant pages
      const retriever = createRetriever();
      const retrievedPages = await retriever.retrieve(question, documentId, 3);

      if (retrievedPages.length === 0) {
        throw new Error('No pages retrieved for the query');
      }

      // Step 2: Generate grounded answer
      const llmProvider = createLLMProvider();
      const llmResponse = await llmProvider.generateAnswer(
        question,
        retrievedPages,
        doc.title
      );

      // Step 3: Validate citations against retrieved pages
      const validCitations = citationService.validateCitations(
        llmResponse.citations,
        retrievedPages
      );

      const retrievedPageNumbers = retrievedPages.map(p => p.page_number);

      // Step 4: Persist conversation
      const conversation = conversationService.createConversation({
        documentId,
        ownerId,
        question,
        answer: llmResponse.answer,
        citations: validCitations,
        retrievedPages: retrievedPageNumbers,
        confidence: llmResponse.confidence,
        provenance: llmResponse.provenance,
        retrievalMode: retriever.mode,
      });

      logEvent({
        level: 'info',
        event: 'answer_generated',
        document_id: documentId,
        user_id: ownerId,
        duration_ms: Date.now() - startTime,
        details: {
          conversation_id: conversation.id,
          retrieval_mode: retriever.mode,
          llm_provider: llmProvider.provider,
          pages_retrieved: retrievedPageNumbers.length,
          citations_count: validCitations.length,
        },
      });

      return {
        answer: llmResponse.answer,
        citations: validCitations,
        retrieved_pages: retrievedPageNumbers,
        confidence: llmResponse.confidence,
        provenance: llmResponse.provenance,
        retrieval_mode: retriever.mode,
        conversation_id: conversation.id,
      };
    } catch (error) {
      logEvent({
        level: 'error',
        event: 'answer_generation_failed',
        document_id: documentId,
        duration_ms: Date.now() - startTime,
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      throw error;
    }
  },
};
