$files = Get-ChildItem 'src\content\berita\*.md'
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $content = $content -replace 'category: Kegiatan Desa', 'category: src/content/categories/kegiatan-desa.md'
    $content = $content -replace 'category: Ekonomi', 'category: src/content/categories/ekonomi.md'
    $content = $content -replace 'category: Sosial', 'category: src/content/categories/sosial.md'
    $content = $content -replace 'category: Pembangunan', 'category: src/content/categories/pembangunan.md'
    $content = $content -replace 'category: Pengumuman', 'category: src/content/categories/pengumuman.md'
    Set-Content $f.FullName $content -NoNewline
}

$files = Get-ChildItem 'src\content\umkm\*.md'
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $content = $content -replace 'category: Makanan', 'category: src/content/categories/makanan.md'
    $content = $content -replace 'category: Kerajinan', 'category: src/content/categories/kerajinan.md'
    $content = $content -replace 'category: Pertanian', 'category: src/content/categories/pertanian.md'
    $content = $content -replace 'category: Minuman', 'category: src/content/categories/minuman.md'
    Set-Content $f.FullName $content -NoNewline
}

$files = Get-ChildItem 'src\content\gallery\*.md'
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $content = $content -replace 'category: "Alam"', 'category: src/content/categories/alam.md'
    $content = $content -replace "category: 'Alam'", 'category: src/content/categories/alam.md'
    $content = $content -replace 'category: Alam', 'category: src/content/categories/alam.md'
    $content = $content -replace 'category: "Kegiatan"', 'category: src/content/categories/kegiatan.md'
    $content = $content -replace "category: 'Kegiatan'", 'category: src/content/categories/kegiatan.md'
    $content = $content -replace 'category: Kegiatan', 'category: src/content/categories/kegiatan.md'
    $content = $content -replace 'category: "Infrastruktur"', 'category: src/content/categories/infrastruktur.md'
    $content = $content -replace "category: 'Infrastruktur'", 'category: src/content/categories/infrastruktur.md'
    $content = $content -replace 'category: Infrastruktur', 'category: src/content/categories/infrastruktur.md'
    $content = $content -replace 'category: "Ekonomi"', 'category: src/content/categories/ekonomi.md'
    $content = $content -replace "category: 'Ekonomi'", 'category: src/content/categories/ekonomi.md'
    $content = $content -replace 'category: Ekonomi', 'category: src/content/categories/ekonomi.md'
    $content = $content -replace 'category: "Lainnya"', 'category: src/content/categories/lainnya.md'
    $content = $content -replace "category: 'Lainnya'", 'category: src/content/categories/lainnya.md'
    $content = $content -replace 'category: Lainnya', 'category: src/content/categories/lainnya.md'
    Set-Content $f.FullName $content -NoNewline
}

Write-Host "Migration complete!"
