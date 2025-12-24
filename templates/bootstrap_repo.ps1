param(
    [switch]$CreateGithubRepo = $false,
    [string]$GithubUser = 'ryanwelchtech',
    [string]$RepoName = 'Deceptive-Telemetry-Lab'
)

# This is a *template* bootstrap script. Copy it to scripts\bootstrap_repo.ps1 locally and keep the local copy out of git.

Write-Host "Bootstrapping repo locally..."

# Install Node dependencies for services
Push-Location src\honeypot
if (-not (Test-Path node_modules)) { npm ci }
Pop-Location
Push-Location src\collector
if (-not (Test-Path node_modules)) { npm ci }
Pop-Location

Write-Host "Created local node_modules for services."

if ($CreateGithubRepo) {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { Write-Host 'gh CLI not found; install and authenticate before running with -CreateGithubRepo'; exit 1 }
    gh repo create $GithubUser/$RepoName --public --source=. --remote=origin --push
}

Write-Host "Bootstrap complete. Update scripts\bootstrap_repo.ps1 per your environment and add credentials to .env (do not commit)."
