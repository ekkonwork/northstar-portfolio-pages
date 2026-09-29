param(
  [string]$ProductionRoot = (Join-Path $PSScriptRoot '..\..\qwen21-kadr3-production')
)

$ErrorActionPreference = 'Stop'
$siteRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$productionRoot = (Resolve-Path $ProductionRoot).Path
$manifest = Get-Content (Join-Path $productionRoot 'final_portfolio/export_manifest.json') -Raw | ConvertFrom-Json
$selected = @('01','02','04','06','08','09','10','11','12','13','15','17','21','22','23','24','27','40','43','47','51','53','63')
$sourceNames = @(
  'jacket_phone_source.png','leggings_phone_source.png','underwear_phone_source.png',
  'takeaway_coffee_pattern_phone_source.png','lemon_tart_restaurant_phone_source.png',
  'pappardelle_restaurant_phone_source.png','salmon_toast_phone_source.png',
  'lounge_chair_phone_source.png','silver_ring_phone_source.png','watch_phone_source.png'
)

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

foreach ($prefix in $selected) {
  $item = $manifest.heroes | Where-Object { $_.id -like "${prefix}_*" } | Select-Object -First 1
  if (-not $item) { throw "Missing manifest item: $prefix" }
  $from = Join-Path $productionRoot $item.webp
  $to = Join-Path $outputDir (Split-Path $from -Leaf)
  Add-Hardlink $from $to
}
foreach ($name in $sourceNames) {
  Add-Hardlink (Join-Path $productionRoot "experiments/portfolio_2026/sources/$name") (Join-Path $referenceDir $name)
}
Write-Output "Synced $($selected.Count) results and $($sourceNames.Count) references with hardlinks."
