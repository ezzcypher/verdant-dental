# Pushes this project's environment variables to Vercel, then deploys.
#
# Run from the project root:   powershell -ExecutionPolicy Bypass -File scripts\setup-vercel.ps1
#
# Values are read from .env and piped to the Vercel CLI over stdin, so nothing
# is ever re-typed or pasted into a web form — that is the single most common
# cause of "works locally, 500s in production" (a stray quote or newline in a
# stored value). Nothing is printed to the console.
#
# Safe to re-run: --force overwrites an existing value of the same name.

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not (Test-Path ".env")) { throw ".env not found. Copy .env.example to .env first." }
if (-not (Test-Path ".vercel\project.json")) { throw "Not linked. Run: npx vercel link --yes --project verdant-dental" }

# ---- parse .env, stripping one layer of surrounding quotes -------------------
$vars = @{}
foreach ($line in (Get-Content ".env")) {
  if ($line -match '^\s*([A-Z_0-9]+)\s*=\s*(.*)$') {
    $v = $matches[2].Trim()
    if ($v.Length -ge 2 -and (($v[0] -eq '"' -and $v[-1] -eq '"') -or ($v[0] -eq "'" -and $v[-1] -eq "'"))) {
      $v = $v.Substring(1, $v.Length - 2)
    }
    if ($v) { $vars[$matches[1]] = $v }
  }
}

# Optional Anthropic key may live in .env.ai instead.
if (Test-Path ".env.ai") {
  $ai = Get-Content ".env.ai" -Raw
  if ($ai -match 'ANTHROPIC_API_KEY\s*=\s*"?(sk-ant-[A-Za-z0-9_\-]+)"?') { $vars["ANTHROPIC_API_KEY"] = $matches[1] }
}

$required = @("DATABASE_URL", "DIRECT_URL", "AUTH_SECRET", "IP_HASH_SALT", "ADMIN_PASSWORD_HASH")
$optional = @("ANTHROPIC_API_KEY", "AI_MODEL", "ALLOWED_ORIGINS")

foreach ($n in $required) {
  if (-not $vars.ContainsKey($n)) { throw "$n is missing from .env — cannot deploy without it." }
}

# ---- push to Vercel ----------------------------------------------------------
# Secrets go up as --sensitive: Vercel stores them write-only, so they cannot be
# read back out of the dashboard or the API afterwards. ALLOWED_ORIGINS and
# AI_MODEL are plain config, not secrets.
$plain = @("ALLOWED_ORIGINS", "AI_MODEL")

foreach ($name in ($required + $optional)) {
  if (-not $vars.ContainsKey($name)) { Write-Host "  skip     $name (not set)"; continue }
  $flag = if ($plain -contains $name) { "--no-sensitive" } else { "--sensitive" }
  foreach ($target in @("production", "preview")) {
    $vars[$name] | npx --yes vercel@latest env add $name $target --force $flag --yes *> $null
    if ($LASTEXITCODE -eq 0) { Write-Host "  ok       $name [$target]" }
    else { Write-Host "  FAILED   $name [$target]" -ForegroundColor Red }
  }
}

Write-Host ""
Write-Host "Configured on Vercel (names only, values never shown):"
npx --yes vercel@latest env ls production

Write-Host ""
Write-Host "Deploying to production..." -ForegroundColor Cyan
npx --yes vercel@latest deploy --prod --yes
