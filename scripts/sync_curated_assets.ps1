param(
  [string]$ProductionRoot = (Join-Path $PSScriptRoot '..\..\qwen21-kadr3-production')
)

$ErrorActionPreference = 'Stop'
$siteRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$productionRoot = (Resolve-Path $ProductionRoot).Path
$manifest = Get-Content (Join-Path $productionRoot 'final_portfolio/export_manifest.json') -Raw | ConvertFrom-Json
$selected = @(
  '01','02','03','04','05','06','07','08','09','10','11','12','13','15','16','17',
  '18','19','20','21','22','23','24','25','27','28','29','30','31','32','33','34',
  '35','36','37','39','40','41','42','43','44','47','49','51','52','53','54','55',
  '56','57','58','61','62','63'
)
$sourceNames = @(
  'jacket_phone_source.png','leggings_phone_source.png','underwear_phone_source.png',
  'takeaway_coffee_pattern_phone_source.png','lemon_tart_restaurant_phone_source.png',
  'pappardelle_restaurant_phone_source.png','salmon_toast_phone_source.png',
  'lounge_chair_phone_source.png','silver_ring_phone_source.png','watch_phone_source.png',
  'w2_boardroom_glass_ref.png','w2_atrium_daylight_ref.png',
  'w2_bedroom_soft_morning_ref.png','w2_terrace_greenery_ref.png',
  'w3_boardroom_seated_ref.png','w3_glass_corridor_ref.png','w3_office_window_ref.png',
  'w3_evening_lounge_ref.png','w3_bedside_morning_ref.png',
  'w2_dark_timber_counter_ref.png','w2_matte_black_slate_ref.png',
  'w2_bakery_warm_morning_ref.png','w3_cafetable_warm_ref.png'
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
