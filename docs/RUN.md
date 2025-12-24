# Run & Dev Guide

Requirements:
- Docker & Docker Compose
- Node.js 18+ (for local dev)
- PowerShell (optional) for using the bootstrap script

Local development (recommended):
1. Copy the bootstrap template to a local script:
   - `copy templates\bootstrap_repo.ps1 scripts\bootstrap_repo.ps1`
   - Edit `scripts\bootstrap_repo.ps1` to set `-CreateGithubRepo` to `$false` if you don't want remote creation.
2. Run the script (PowerShell): `.	emplates\bootstrap_repo.ps1` or your local `scripts\bootstrap_repo.ps1`.
3. Start the services:
   - `docker compose up --build`
4. Endpoints:
   - Honeypot: `http://localhost:8083/` (health, /hit)
   - Collector: `http://localhost:8084/` (health, /reports)

Artifacts:
- Scan and report artifacts are stored in `artifacts/` (on the host via volume mount)

CI and Security:
- `.github/workflows/ci.yml` runs basic unit tests.
- `.github/workflows/security.yml` runs Trivy and will fail on CRITICAL/HIGH vulnerabilities for `ryanwelchtech/detellab:latest` (update image name if you change tags).
