# Dependency repairs

The frontend, backend, and MCP dependency graphs now include the security
updates found in the repository audit. Both CPU and CUDA selections use Torch
2.13.0. The MCP image installs its new committed uv lockfile with `--frozen`.
The new dependency workflow audits the frontend, backend CUDA graph (including
development dependencies), and MCP graph without starting services.

Validation on hermes: frontend lint, type checking, production build, and three
focused Better Auth integration cases passed. The same three cases passed again
after the final Vite peer-dependency refresh. Backend and MCP locked installs,
dependency compatibility, compilation, and core backend imports passed. Two
attempts to collect two backend unit cases failed because the isolated fixture
lacked OS libraries and then its test import path; no backend test passed or is
claimed. These attempts plus six frontend executions consume the ten-case task
budget. No full test suite was run.

No production service was restarted and no jobs, database records, or credentials
were changed. Before release, run the existing `Image security` checks against
fresh final images, wait for active clip work to finish, and follow the project
release procedure. A clean package audit is not a production image scan.
