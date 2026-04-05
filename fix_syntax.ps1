$content = Get-Content skyvoyage-complete.html
$content = $content.Replace('});', '});')
Set-Content -Path skyvoyage-complete.html -Value $content -Force
