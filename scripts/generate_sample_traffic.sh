#!/usr/bin/env bash
COUNT=${1:-5}
HONEYPOT_URL=${HONEYPOT_URL:-http://localhost:8083/hit}
REPORTS_URL=${REPORTS_URL:-http://localhost:8084/reports}

paths=("/" "/admin" "/wp-login.php" "/phpinfo.php" "/login")
uas=("Mozilla/5.0" "nmap/7.80" "curl/7.68.0" "scanner/1.0")

echo "Posting $COUNT simulated hits to $HONEYPOT_URL"
for i in $(seq 1 $COUNT); do
  path=${paths[$((RANDOM % ${#paths[@]}))]}
  ua=${uas[$((RANDOM % ${#uas[@]}))]}
  payload="{\"path\":\"$path\",\"ua\":\"$ua\"}"
  curl -s -X POST "$HONEYPOT_URL" -H "Content-Type: application/json" -d "$payload" >/dev/null && echo "[$i] Posted: $payload" || echo "[$i] Failed to post"
  sleep 0.5
done

echo "Waiting briefly for collector to ingest (2s)"
sleep 2

echo "Fetching reports from collector: $REPORTS_URL"
curl -s "$REPORTS_URL" | jq -r '.[] | "id: \(.id) path: \(.path) ua: \(.ua) severity: \(.severity) received_at: \(.received_at)"' | tail -n 10 || echo "Collector not reachable or returned no reports"

echo "Done."