param(
  [string]$ProductionRoot = (Join-Path $PSScriptRoot '..\..\qwen21-kadr3-production')
)

$ErrorActionPreference = 'Stop'
$siteRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$productionRoot = (Resolve-Path $ProductionRoot).Path
$manifest = Get-Content (Join-Path $productionRoot 'final_portfolio/export_manifest.json') -Raw | ConvertFrom-Json
$curation = Get-Content (Join-Path $siteRoot 'js/curated.js') -Raw
if ($curation -match "referenceKind: 'scene'") {
  throw 'The public gallery must use product or model references, not empty scenes.'
}
$selected = @([regex]::Matches($curation, "id: '(\d{2}_[^']+)', section:") |
  ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique)
$sourceNames = @([regex]::Matches($curation, "source: '([^']+)'") |
  ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique)
$additional = @{
  '65_food_takeaway_coffee_city_landscape' = 'portfolio_ready/Food Design/Takeaway Coffee/02_City_Landscape.png'
  '69_food_pappardelle_restaurant' = 'portfolio_ready/Food Design/Restaurant/01_Pappardelle.png'
}

$outputDir = Join-Path $siteRoot 'assets/curated'
$referenceDir = Join-Path $outputDir 'references'
New-Item -ItemType Directory -Force -Path $outputDir,$referenceDir | Out-Null

function Add-Hardlink([string]$from, [string]$to) {
  if (-not (Test-Path -LiteralPath $from)) { throw "Missing source: $from" }
  if (Test-Path -LiteralPath $to) {
    $a = (Get-FileHash -LiteralPath $from -Algorithm SHA256).Hash
    $b = (Get-FileHash -LiteralPath $to -Algorithm SHA256).Hash
    if ($a -ne $b) { throw "Existing asset differs: $to" }
    return
  }
  New-Item -ItemType HardLink -Path $to -Target $from | Out-Null
}

foreach ($id in $selected) {
  $to = Join-Path $outputDir "$id.webp"
  if ($additional.ContainsKey($id)) {
    $from = Join-Path $productionRoot $additional[$id]
    if (-not (Test-Path -LiteralPath $from)) { throw "Missing source: $from" }
    if (-not (Test-Path -LiteralPath $to)) {
      & ffmpeg -hide_banner -loglevel error -y -i $from -frames:v 1 -c:v libwebp -quality 88 -compression_level 6 $to
      if ($LASTEXITCODE -ne 0) { throw "WebP conversion failed: $id" }
    }
    continue
  }
  $item = $manifest.heroes | Where-Object { $_.id -eq $id } | Select-Object -First 1
  if (-not $item) { throw "Missing manifest item: $id" }
  $from = Join-Path $productionRoot $item.webp
  Add-Hardlink $from $to
}
foreach ($name in $sourceNames) {
  Add-Hardlink (Join-Path $productionRoot "experiments/portfolio_2026/sources/$name") (Join-Path $referenceDir $name)
}
Write-Output "Synced $($selected.Count) results and $($sourceNames.Count) references."
