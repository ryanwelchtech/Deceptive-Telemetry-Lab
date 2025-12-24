# Architecture & Design Notes

Purpose:
- Demonstrate a repeatable, auditable demo pipeline for deceptive telemetry collection and rule-based detection.

Components:
- Honeypot service (`src/honeypot`): exposes lightweight endpoints to receive simulated attacker interactions and forwards events to the Collector.
- Collector service (`src/collector`): receives events, applies deterministic detection rules (e.g., path-based, UA-based heuristics), stores events and generates JSON reports and simple CSV summaries.
- n8n workflow (`automation/n8n_data/workflows/post_project.json`): template to publish releases to LinkedIn and ClearanceJobs (requires real credentials and OAuth tokens to operate).
- CI: Basic Node unit tests and Trivy scanning with a failure policy on CRITICAL/HIGH vulnerabilities.

Security & Compliance Considerations:
- Design favors non-root runtime in Dockerfiles and small base images.
- Health endpoints exist on both services for readiness/liveness checks used by orchestrators.
- Artifacts contain evidence of scans and remediation steps that could be used in an audit or PR.

Extensibility:
- Swap the simulated scanner with a real scanner (Trivy/Anchore) by replacing the `simulateScan()` placeholder with an adapter module.
- Add JWT-based auth between services for stronger Zero Trust demo scenarios.
