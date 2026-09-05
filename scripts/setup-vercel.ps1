# Pushes this project's environment variables to Vercel, then deploys.
#
# Run from the project root:
#   powershell -ExecutionPolicy Bypass -File scripts\setup-vercel.ps1
#
# Values are read from .env and piped to the Vercel CLI over stdin, so nothing is
# ever re-typed or pasted into a web form. That is the single most common cause
# of "works locally, 500s in production" (a stray quote or newline in a stored
# value). Values are never printed.
#
# Safe to re-run: --force overwrites an existing value of the same name.
#
# Two Windows PowerShell 5.1 hazards this file works around:
#
#  1. .ps1 files are read using the system ANSI codepage, not UTF-8, so a UTF-8
#     character such as an em dash is mis-decoded and breaks parsing. This file
#     is therefore pure ASCII.
#
#  2. The Vercel CLI writes its banner to stderr. PowerShell wraps native stderr
#     in a NativeCommandError, and under $ErrorActionPreference = "Stop" that
#     becomes a TERMINATING error even when the command exited 0. So the
#     preference stays "Continue" and success is judged by $LASTEXITCODE only.
#     Preconditions below use throw, which terminates regardless.

$ErrorActionPreference = "Continue"
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not (Test-Path ".env")) { throw ".env not found. Copy .env.example to .env first." }
if (-not (Test-Path ".vercel\project.json")) {
  throw "Not linked. Run: npx vercel link --yes --project verdant-dental"
}

# ---- parse .env, stripping one layer of surrounding quotes -------------------
$vars = @{}
foreach ($line in (Get-Content ".env")) {
  if ($line -match '^\s*([A-Z_0-9]+)\s*=\s*(.*)$') {
    $v = $matches[2].Trim()
    if ($v.Length -ge 2) {
      $first = $v.Substring(0, 1)
      $last = $v.Substring($v.Length - 1, 1)
      if (($first -eq '"' -and $last -eq '"') -or ($first -eq "'" -and $last -eq "'")) {
        $v = $v.Substring(1, $v.Length - 2)
      }
    }
    if ($v) { $vars[$matches[1]] = $v }
  }
}

# The optional Anthropic key may live in .env.ai instead.
if (Test-Path ".env.ai") {
  $ai = Get-Content ".env.ai" -Raw
  if ($ai -match 'ANTHROPIC_API_KEY\s*=\s*"?(sk-ant-[A-Za-z0-9_\-]+)"?') {
    $vars["ANTHROPIC_API_KEY"] = $matches[1]
  }
}

$required = @("DATABASE_URL", "DIRECT_URL", "AUTH_SECRET", "IP_HASH_SALT", "ADMIN_PASSWORD_HASH")
$optional = @("ANTHROPIC_API_KEY", "AI_MODEL", "ALLOWED_ORIGINS")

foreach ($n in $required) {
  if (-not $vars.ContainsKey($n)) {
    throw "$n is missing from .env. Cannot deploy without it."
  }
}

# ---- push to Vercel ----------------------------------------------------------
# Secrets go up as --sensitive: Vercel stores them write-only, so they cannot be
# read back out of the dashboard or the API afterwards. ALLOWED_ORIGINS and
# AI_MODEL are plain config, not secrets.
$plain = @("ALLOWED_ORIGINS", "AI_MODEL")
$failed = @()

Write-Host ""
Write-Host "Pushing environment variables..." -ForegroundColor Cyan

foreach ($name in ($required + $optional)) {
  if (-not $vars.ContainsKey($name)) {
    Write-Host ("  skip     {0} (not set)" -f $name) -ForegroundColor DarkGray
    continue
  }
  if ($plain -contains $name) { $flag = "--no-sensitive" } else { $flag = "--sensitive" }

  foreach ($target in @("production", "preview")) {
    $vars[$name] | npx --yes vercel@latest env add $name $target --force $flag --yes *> $null
    if ($LASTEXITCODE -eq 0) {
      Write-Host ("  ok       {0} [{1}]" -f $name, $target) -ForegroundColor Green
    } else {
      Write-Host ("  FAILED   {0} [{1}]  (exit {2})" -f $name, $target, $LASTEXITCODE) -ForegroundColor Red
      $failed += ("{0}[{1}]" -f $name, $target)
    }
  }
}

if ($failed.Count -gt 0) {
  Write-Host ""
  Write-Host ("Some variables did not upload: {0}" -f ($failed -join ", ")) -ForegroundColor Red
  Write-Host "Not deploying with an incomplete configuration. Re-run after fixing." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "Configured on Vercel (names only, values never shown):" -ForegroundColor Cyan
npx --yes vercel@latest env ls production

Write-Host ""
Write-Host "Deploying to production..." -ForegroundColor Cyan
npx --yes vercel@latest deploy --prod --yes
$deployExit = $LASTEXITCODE

Write-Host ""
if ($deployExit -eq 0) {
  Write-Host "Deploy finished. The production URL is printed above." -ForegroundColor Green
} else {
  Write-Host ("Deploy failed (exit {0}). Run: npx vercel logs" -f $deployExit) -ForegroundColor Red
  exit $deployExit
}
