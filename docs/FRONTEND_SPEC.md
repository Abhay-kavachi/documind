# DocuMind — Frontend Specification

## Visual direction
Professional B2B AI product. Prioritize readability, evidence visibility, hierarchy and fast interaction. Avoid excessive animation and decorative AI gimmicks.

## Navigation
Sidebar:
- Documents
- Recent conversations
- Settings

## Document library
Show title, filename, type, page count, status and updated time. Actions: open, authorized delete, ask questions.

## Upload
Provide drag/drop and file picker, validation feedback, progress and processing state.

## Workspace
Recommended layout:

```text
+----------------+---------------------------+
| Document/evidence | Conversation            |
|                  | Question                |
|                  | Answer                  |
|                  | Sources/citations       |
+----------------+---------------------------+
```

## Question interface
Input, submit, loading and error states. Keyboard accessible.

## Answer
Show answer, confidence, page citations and evidence cards. Never show hidden chain-of-thought. Concise provenance is acceptable.

## Evidence viewer
Show page number, thumbnail/preview and meaningful relevance metadata. Allow larger preview.

## Conversation history
Show question, answer, citations and timestamp.

## States
Every major screen needs loading, empty, success and error states. Processing states are Processing, Ready and Error.

## Accessibility
Semantic HTML, keyboard navigation, visible focus, contrast, labels, useful alt text and accessible errors.

## Responsive
Desktop first, but tablet/mobile must remain usable, including evidence/citation functionality.

## Demo mode
Clearly label demo documents and deterministic demo answers. Never imply demo retrieval is live ColPali inference.
