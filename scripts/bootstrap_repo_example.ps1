# Copy this file to scripts\bootstrap_repo.ps1 and update -CreateGithubRepo parameter before running locally.
# The actual scripts\bootstrap_repo.ps1 should be kept out of git and is ignored via .gitignore
param(
    [switch]$CreateGithubRepo = $false,
    [string]$GithubUser = 'ryanwelchtech',
    [string]$RepoName = 'Deceptive-Telemetry-Lab'
)

Write-Host "Example bootstrap script. Copy and customize as needed."
