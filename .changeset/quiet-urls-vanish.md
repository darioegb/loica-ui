---
'@loica-ui/react': patch
---

Publish the JavaScript bundles unminified (consumer bundlers already minify them) and remove the redundant `xmlns` attribute from the DatePicker navigation icons, so the package no longer triggers Socket's "Minified code" and "URL strings" alerts.
