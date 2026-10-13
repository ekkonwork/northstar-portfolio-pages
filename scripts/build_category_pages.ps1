$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
& node (Join-Path $PSScriptRoot 'build_category_pages.mjs') @args
if ($LASTEXITCODE -ne 0) { throw "Category page build failed with exit code $LASTEXITCODE" }
