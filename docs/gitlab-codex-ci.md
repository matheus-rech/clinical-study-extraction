# GitLab Codex CI Integration

This repository ships with a `.gitlab-ci.yml` pipeline adapted from the OpenAI Codex Secure Quality cookbook. It applies Codex-powered reasoning to code quality, security triage, and automated remediation tailored to the Clinical Study Extraction System. For the GitHub Actions equivalent, see `docs/github-codex-ci.md`.

## Pipeline overview

| Stage | Job | Purpose |
| --- | --- | --- |
| test | `playwright_tests` | Runs the Playwright end-to-end suite in the official container image to guard core PDF/A.I. workflows. |
| sast | `semgrep_sast` | Generates `gl-sast-report.json` in GitLab SAST schema using Semgrep (`--gitlab-sast`). Allow-fails but always emits a report. |
| codex | `codex_quality` | Invokes Codex CLI to emit a CodeClimate JSON array focused on SPA maintainability, AI prompt hardening, and systematic review flows. |
| codex | `codex_security_triage` | Post-processes SAST findings into `security_priority.md`, deduplicating and ranking issues with contextual remediation steps. |
| remediation | `codex_remediation` | Requests Codex to draft minimal unified diffs for High/Critical SAST findings, validated with `git apply --check`. |

## Prerequisites

1. **GitLab Runner** – Linux runner with internet egress, 2 vCPU / 8 GB RAM recommended.
2. **OpenAI API key** – Add a masked, protected CI/CD variable named `OPENAI_API_KEY`.
3. **Optional** – Provide `CI_COMMIT_BRANCH`-scoped runner tokens if using project runners.

Codex jobs are gated on the presence of `OPENAI_API_KEY`; they are skipped automatically otherwise.

## Secrets and compliance

- Keep the API key protected and masked. The pipeline never writes secrets to artifacts.
- Codex outputs are validated through strict markers, JSON parsing, and fallbacks (`[]` or minimal Markdown) to avoid noisy failures.
- Generated patches land under `codex_patches/` plus a dotenv (`codex.env`) flag indicating whether patches were created.

## Local reproduction

To iterate on prompts locally, install Codex CLI and reuse the prompts from `.gitlab-ci.yml`:

```bash
npm -g install @openai/codex@latest
export OPENAI_API_KEY=***
codex exec --full-auto "$(cat prompt.txt)"
```

Populate `prompt.txt` with the relevant prompt block plus the file allowlist produced by `git ls-files`.

## Updating prompts

- Keep markers (`=== BEGIN_* ===` / `=== END_* ===`) unchanged; CI parsing relies on them.
- Scope findings to this repository’s reality: single-page `index.html`, Playwright tests, localStorage persistence, Gemini API boundaries.
- Prefer fewer, higher-signal findings so Merge Request widgets stay actionable.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Codex jobs skipped | `OPENAI_API_KEY` missing | Set the variable at project/group level. |
| `codex_quality` artifact is `[]` | Codex returned invalid JSON | Inspect `artifacts/codex-quality-raw.log` for prompt tuning. |
| `codex_remediation` produces no patches | No High/Critical findings or diffs failed validation | Review `codex.env` and raw log to adjust prompts or rerun SAST. |
| Semgrep job fails | Runner lacks internet or `semgrep` crashed | Check job logs; pipeline still emits empty SAST report to keep Codex stages running. |

For deeper customization, adjust job prompts or replace the Semgrep SAST step with GitLab’s native analyzers while preserving the artifact name (`gl-sast-report.json`).
