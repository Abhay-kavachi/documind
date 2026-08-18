# DocuMind — Feature Ticket List

## P0 — Must Have

### DOC-001 Project foundation
Set up framework, environment, lint, typecheck and tests.
Acceptance: app starts, build succeeds, `.env.example` exists, no secrets committed.

### DOC-002 Document upload
Secure PDF upload with validation and processing state.

### DOC-003 Document processing
Create document record, determine page count, render pages, persist metadata, handle failures.

### DOC-004 ColPali retrieval abstraction
Implement `DocumentRetriever` and `ColPaliRetriever`; isolate fallback and never mislabel it.

### DOC-005 Question answering
Question → retrieval → multimodal grounded answer.

### DOC-006 Citations
Map answers to exact retrieved page numbers.

### DOC-007 Evidence viewer
Show retrieved page previews and page numbers.

### DOC-008 Conversation persistence
Persist questions, answers, citations and retrieved pages.

### DOC-009 Demo mode
Deterministic usable demo without paid credentials, clearly labelled.

### DOC-010 Authorization
Server-side ownership checks for documents, pages and conversations.

### DOC-011 Security tests
Injection, upload, path traversal and authorization tests.

### DOC-012 Production validation
Lint, typecheck, tests, build and end-to-end validation.

### DOC-013 Documentation
Create PRD, architecture, security, frontend and ticket documentation.

## P1 — Important
- DOC-014 Background processing
- DOC-015 Safe retry handling
- DOC-016 Structured observability
- DOC-017 Improved page preview/navigation

## P2 — Future
- DOC-018 Multi-document comparison
- DOC-019 Additional document formats
- DOC-020 Advanced document management
- DOC-021 ColPali batching/caching/GPU optimization
- DOC-022 Enterprise access controls
