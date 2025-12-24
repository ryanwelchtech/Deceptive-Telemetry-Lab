# Deceptive Telemetry Lab (DeTelLab)

A compact, portfolio-ready demo that simulates deceptive telemetry (honeypot) collection, detection rules, and reporting pipelines for defense-focused security engineering.

Highlights:
- Lightweight honeypot simulator that emits and records suspicious telemetry (`src/honeypot`)
- Central collector that ingests events, applies deterministic detection rules, and produces audit-ready reports (`src/collector`)
- Docker Compose environment to run services locally
- CI pipeline with Trivy security gating; artifacts and SBOM examples are generated
- `templates/bootstrap_repo.ps1` helps generate a local `scripts/bootstrap_repo.ps1` (which should be added to `.gitignore` for local workflow)

Quickstart:
1. Copy `templates/bootstrap_repo.ps1` to `scripts/bootstrap_repo.ps1`, then run it locally (PowerShell) to install dependencies and optionally create a GitHub repo.
2. Run: `docker compose up --build`
3. Visit `GET http://localhost:8083/health` (honeypot) and `GET http://localhost:8084/health` (collector).
4. POST a simulated interaction: `curl -X POST http://localhost:8083/hit -d '{"path":"/admin","ua":"scanner/1.0"}' -H "Content-Type: application/json"`

For full instructions see `docs/RUN.md` and design notes in `docs/ARCHITECTURE.md`.

## Generate sample telemetry (demo scripts) ✅

Two helper scripts are provided to generate sample telemetry and show example reports:

- PowerShell (Windows): `scripts\generate_sample_traffic.ps1` - runs multiple POSTs to the honeypot and fetches collector reports.
  - Quick usage:
    - `copy templates\bootstrap_repo.ps1 scripts\bootstrap_repo.ps1` (only once)
    - `.	emplates\bootstrap_repo.ps1` (or your local `scripts\bootstrap_repo.ps1`)
    - `.	emplates\..` (see scripts) or run `.	emplates\..` 
    - `.	emplates\..` 
    - `powershell -File scripts\generate_sample_traffic.ps1 -Count 5`

- Bash (macOS / Linux): `scripts/generate_sample_traffic.sh` — uses `curl` and optionally `jq` to pretty-print results.
  - Example: `bash scripts/generate_sample_traffic.sh 10`

Sample output (collector report excerpt):
```
id,path,ua,severity,received_at
txnvkf4d,/admin,nmap/7.80,HIGH,2025-12-24T00:59:38.747Z
xlped3zj,/admin,nmap/7.80,HIGH,2025-12-24T01:00:19.748Z
7uam1rqf,/admin,nmap/7.80,HIGH,2025-12-24T01:01:22.932Z
```

A sample report is available in `docs/sample_report.csv` for reference.

Notes:
- Ensure both services are running: `docker compose up --build -d` and health checks respond (honeypot: `http://localhost:8083/health`, collector: `http://localhost:8084/health`).
- Bash script optionally uses `jq` (install for better output formatting).
