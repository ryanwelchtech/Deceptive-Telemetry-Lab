# Deceptive Telemetry Lab (DeTelLab)

A compact, portfolio-ready demo that simulates deceptive telemetry (honeypot) collection, detection rules, and reporting pipelines for defense-focused security engineering.

Highlights:
- Lightweight honeypot simulator that emits and records suspicious telemetry (`src/honeypot`)
- Central collector that ingests events, applies deterministic detection rules, and produces audit-ready reports (`src/collector`)
- Docker Compose environment to run services and an `n8n` automation instance locally
- CI pipeline with Trivy security gating; artifacts and SBOM examples are generated
- `templates/bootstrap_repo.ps1` helps generate a local `scripts/bootstrap_repo.ps1` (which should be added to `.gitignore` for local workflow)

Quickstart:
1. Copy `templates/bootstrap_repo.ps1` to `scripts/bootstrap_repo.ps1`, then run it locally (PowerShell) to install dependencies and optionally create a GitHub repo.
2. Run: `docker compose up --build`
3. Visit `GET http://localhost:8083/health` (honeypot) and `GET http://localhost:8084/health` (collector).
4. POST a simulated interaction: `curl -X POST http://localhost:8083/hit -d '{"path":"/admin","ua":"scanner/1.0"}' -H "Content-Type: application/json"`

For full instructions see `docs/RUN.md` and design notes in `docs/ARCHITECTURE.md`.
