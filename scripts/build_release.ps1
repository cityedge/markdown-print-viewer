param([string] $CacheDirectory = '')
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$manifest = Get-Content -Raw -Encoding utf8 (Join-Path $root 'licenses/dependencies.json') | ConvertFrom-Json
$version = $manifest.appVersion
& (Join-Path $root 'offline/build_offline.ps1') -CacheDirectory $CacheDirectory

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$dist = Join-Path $root 'dist'
[IO.Directory]::CreateDirectory($dist) | Out-Null

function Write-Package([string] $Name, [System.Collections.IDictionary] $Files) {
    $target = Join-Path $dist $Name
    $stream = [IO.File]::Open($target, [IO.FileMode]::Create)
    $zip = New-Object IO.Compression.ZipArchive($stream, [IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($entry in $Files.GetEnumerator()) {
            $file = Join-Path $root $entry.Value
            if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { throw "Missing release file: $file" }
            [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file, $entry.Key, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    } finally { $zip.Dispose(); $stream.Dispose() }
    Write-Host ("Package: {0} ({1:N0} bytes)" -f $target, (Get-Item -LiteralPath $target).Length)
}

$common = [ordered]@{}
foreach ($name in @('LICENSE', 'THIRD_PARTY_NOTICES.md', 'THIRD_PARTY_LICENSES.txt', 'THIRD_PARTY_SOURCES.md', 'licenses.html', 'licenses/dependencies.json', 'CHANGELOG.md')) {
    $common[$name] = $name
}
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $root 'examples') -File -Recurse) {
    $relative = $file.FullName.Substring($root.Length + 1).Replace('\', '/')
    $common[$relative] = $relative
}
$standard = [ordered]@{}
foreach ($entry in $common.GetEnumerator()) { $standard[$entry.Key] = $entry.Value }
foreach ($name in @('.gitattributes', 'index.html', 'manifest.webmanifest', 'service-worker.js', 'README.md', 'README_EN.md', 'INSTALL_GUIDE.md', 'INSTALL_GUIDE_EN.md', 'RELEASE_CHECKLIST.md', 'BUILD_RELEASE.cmd', 'scripts/build_release.ps1', 'offline/README.md', 'offline/BUILD_OFFLINE.cmd', 'offline/build_offline.ps1', 'offline/index.template.html', 'tests/mermaid.cjs', 'tests/licenses.cjs')) {
    $standard[$name] = $name
}
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $root 'icons') -File) { $standard['icons/' + $file.Name] = 'icons/' + $file.Name }
Write-Package "markdown-print-viewer-v$version-standard.zip" $standard

$offline = [ordered]@{}
foreach ($entry in $common.GetEnumerator()) { $offline[$entry.Key] = $entry.Value }
$offline['index.html'] = 'offline/index.html'
$offline['README.md'] = 'offline/README.md'
Write-Package "markdown-print-viewer-v$version-offline.zip" $offline

$lines = foreach ($name in @("markdown-print-viewer-v$version-standard.zip", "markdown-print-viewer-v$version-offline.zip")) {
    "{0}  {1}" -f (Get-FileHash -LiteralPath (Join-Path $dist $name) -Algorithm SHA256).Hash.ToLowerInvariant(), $name
}
[IO.File]::WriteAllText((Join-Path $dist 'SHA256SUMS.txt'), ($lines -join "`n") + "`n", (New-Object Text.UTF8Encoding($false)))
Write-Host 'Release packages and SHA256SUMS.txt are ready.'
