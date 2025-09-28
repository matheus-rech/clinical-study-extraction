# GitHub Actions – Codex Secure Quality Workflow

This repository ships a GitHub Actions workflow at `.github/workflows/codex-secure-quality.yml` that mirrors the Codex-enabled GitLab pipeline. It runs end-to-end tests, Semgrep SAST, Codex-powered quality analysis, security triage, and optional remediation patch generation.

## Trigger model

The workflow runs on every push and pull request targeting `main`. Codex jobs automatically skip when the repository secret `OPENAI_API_KEY` is missing (for example, on pull requests opened from forks).

## Job matrix

| Job | Stage | Purpose |
| --- | --- | --- |
| `playwright-tests` | test | Installs dependencies, provisions browsers (`npx playwright install --with-deps`), and executes the Playwright suite. Captures JUnit XML and HTML reports as artifacts. |
| `semgrep-sast` | sast | Executes Semgrep in `--gitlab-sast` mode to emit `gl-sast-report.json`. A fallback empty report is generated on failure so downstream Codex jobs have consistent input. |
| `codex-quality` | codex | Uses Codex CLI to emit a CodeClimate JSON array focused on SPA maintainability, AI integration boundaries, and systematic review flow integrity. Artifacts: `gl-code-quality-report.json` + raw Codex log. |
| `codex-security-triage` | codex | Post-processes Semgrep findings into `security_priority.md`, deduplicating and ranking results with tailored remediation guidance. |
| `codex-remediation` | remediation | Requests Codex to craft minimal, validated patches for High/Critical SAST findings. Outputs unified diffs under `codex_patches/` and a `codex.env` flag indicating whether patches were produced. |

## Prerequisites

1. **OpenAI API key** – add `OPENAI_API_KEY` to repository or organization secrets. Keep it masked and avoid exposing on forks.
2. **Runner requirements** – the default `ubuntu-latest` runner suffices (2 vCPU, 7 GB RAM). Jobs install additional packages (`jq`, `bsdextrautils`, `git`, `curl`) as part of each Codex step.
3. **Network access** – runners must reach `api.openai.com` for Codex CLI. If egress is restricted, place Codex jobs behind self-hosted runners with outbound access.

## Artifacts and reports

- **Playwright**: `playwright-artifacts` (JUnit XML + HTML/trace output)
- **Semgrep**: `gl-sast-report`
- **Codex quality**: `codex-code-quality`
- **Codex security triage**: `codex-security-triage`
- **Codex remediation**: `codex-remediation` (`codex.env`, raw log, patches)

Inspect artifacts from the GitHub Actions run summary. Apply patches manually via `git apply codex_patches/fix-*.patch` after review.

## Local prompt iteration

To test prompts locally:

```bash
npm install -g @openai/codex@latest
export OPENAI_API_KEY=sk-...
FILE_LIST="$(git ls-files | sed 's/^/- /')"
PROMPT="$(cat <<'EOF'
# paste the CODEX_PROMPT block from the workflow here
EOF
)
PROMPT="$PROMPT
Only report issues in the following existing files (use exact paths):
$FILE_LIST"
codex exec --full-auto "$PROMPT"
```

## Troubleshooting

| Symptom | Likely cause | Resolution |
| --- | --- | --- |
| Codex jobs skipped | `OPENAI_API_KEY` not configured | Add the secret and re-run. |
| `codex-quality` produced `[]` | JSON extraction failed or prompt too strict | Review `codex-code-quality` artifact logs for errors; adjust prompt if needed. |
| `codex-remediation` empty | No High/Critical findings in `gl-sast-report.json` or diffs failed validation | Check `codex.env` for `CODEX_CREATED_PATCHES=false` and inspect the raw log. |
| Semgrep job fails outright | Runner lacks internet or Semgrep crashed | The workflow still emits an empty report; verify runner connectivity or pin a different Semgrep version. |

For broader customization (e.g., uploading CodeClimate JSON to checks or feeding SAST into code scanning), extend the workflow with additional steps while preserving marker-based parsing and validation.
