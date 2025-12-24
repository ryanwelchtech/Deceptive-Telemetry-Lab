param(
    [int]$Count = 5,
    [string]$HoneypotUrl = 'http://localhost:8083/hit',
    [string]$ReportsUrl = 'http://localhost:8084/reports'
)

$paths = @('/','/admin','/wp-login.php','/phpinfo.php','/login')
$uas = @('Mozilla/5.0','nmap/7.80','curl/7.68.0','scanner/1.0')

Write-Host "Posting $Count simulated hits to $HoneypotUrl"
for ($i = 1; $i -le $Count; $i++) {
    $payload = @{ path = $paths[(Get-Random -Minimum 0 -Maximum $paths.Count)]; ua = $uas[(Get-Random -Minimum 0 -Maximum $uas.Count)] }
    try {
        $resp = Invoke-RestMethod -Uri $HoneypotUrl -Method POST -ContentType 'application/json' -Body ($payload | ConvertTo-Json) -TimeoutSec 5 -ErrorAction Stop
        Write-Host "[$i] Posted: " ($payload | ConvertTo-Json) -ForegroundColor Green
    } catch {
        Write-Host "[$i] Failed to post: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "Waiting briefly for collector to ingest (2s)" -ForegroundColor Cyan
Start-Sleep -Seconds 2

Write-Host "Fetching reports from collector: $ReportsUrl" -ForegroundColor Cyan
try {
    $reports = Invoke-RestMethod -Uri $ReportsUrl -UseBasicParsing -TimeoutSec 5
    if ($reports -is [array]) {
        Write-Host "--- Latest reports ---" -ForegroundColor Green
        $reports | Select-Object -Last 10 | Format-Table id, path, ua, severity, received_at -AutoSize
    } else {
        Write-Host "Collector returned no reports or not reachable." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Failed to fetch reports: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Done." -ForegroundColor Green
