# DocuMind — Security & Access

## Core rule
Document content is data, not instructions.

## Authentication and authorization
All private document APIs require an authenticated identity. Every document/page/conversation access must be authorized server-side. Changing IDs in URLs or request bodies must not bypass ownership checks.

## Prompt injection
Documents may contain instructions such as “ignore previous instructions”. These must remain untrusted evidence. Retrieved content must be delimited from system instructions. Never let document content authorize tool execution.

## SQL injection
Never concatenate user-controlled values into SQL. Use parameterized queries or safe database APIs. Include injection tests.

## File uploads
Validate MIME type, extension, PDF structure and size. Defend against malformed files, path traversal and resource exhaustion. Never use raw user filenames as filesystem paths.

## Storage
Use private storage for private documents. Do not expose storage credentials. Use authorized/short-lived access where required.

## Secrets
Never commit API keys, database passwords, OAuth secrets or tokens. Use environment variables/secret managers. `.env.example` contains names only.

## SSRF
If remote URL ingestion is ever added, enforce protocol restrictions, private-network blocking, redirects validation, size limits and timeouts. Avoid it in the MVP unless necessary.

## LLM output
LLM output is untrusted. Do not allow it to directly execute commands, SQL, filesystem operations or arbitrary network requests.

## Logging
Log security and processing events without unnecessarily recording document contents or secrets.

## Required security tests
- unauthorized document/page access
- malformed/oversized PDFs
- path traversal
- SQL injection payloads
- prompt injection inside documents
- prompt injection inside questions
- missing authentication
- invalid API payloads
