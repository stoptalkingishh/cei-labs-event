# Ask PowerPoint itself which text boxes are overset.
#
# Rendering a deck and squinting at it misses marginal cases and cannot tell a
# deliberately roomy box from one that is one word from spilling. TextFrame2
# exposes BoundHeight/BoundWidth -- the actual laid-out extent of the text -- so
# the check becomes arithmetic rather than judgement.
param(
  [Parameter(Mandatory = $true)][string]$Dir,
  [double]$SlackPt = 2.0   # points of tolerance before we call it an overflow
)

$app = New-Object -ComObject PowerPoint.Application
$findings = 0

foreach ($f in Get-ChildItem "$Dir\*.pptx") {
  $pres = $app.Presentations.Open($f.FullName, $true, $false, $false)
  foreach ($slide in $pres.Slides) {
    foreach ($shape in $slide.Shapes) {
      if (-not $shape.HasTextFrame) { continue }
      $tf = $shape.TextFrame2
      if ($tf.HasText -eq 0) { continue }
      $txt = $tf.TextRange.Text
      $bh = $tf.TextRange.BoundHeight
      $bw = $tf.TextRange.BoundWidth
      $overH = $bh - $shape.Height
      $overW = $bw - $shape.Width
      if ($overH -gt $SlackPt -or $overW -gt $SlackPt) {
        $findings++
        $snippet = $txt -replace "`r|`n", " "
        if ($snippet.Length -gt 58) { $snippet = $snippet.Substring(0, 58) + "..." }
        "{0} s{1,-2} [{2,6:N1}pt tall over, {3,6:N1}pt wide over]  {4}" -f `
          $f.BaseName.Replace("CEI-Labs-Game-Guide-", ""), $slide.SlideIndex, $overH, $overW, $snippet
      }
    }
  }
  $pres.Close()
}
$app.Quit()
Start-Sleep -Milliseconds 400
Get-Process POWERPNT -ErrorAction SilentlyContinue | Stop-Process -Force
if ($findings -eq 0) { "no overset text boxes in $Dir" } else { "$findings overset box(es) in $Dir" }
