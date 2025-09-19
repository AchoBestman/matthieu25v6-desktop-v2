# Vérifier si on est dans le bon répertoire
if (!(Test-Path "src-tauri/Cargo.toml")) {
    Write-Host "Erreur: Executez ce script depuis la racine du projet Tauri!" -ForegroundColor Red
    exit 1
}

# Charger la config Tauri pour récupérer la version et le productName
$tauriConfigPath = "src-tauri/tauri.conf.json"
if (!(Test-Path $tauriConfigPath)) {
    Write-Host "Erreur: Fichier tauri.conf.json introuvable !" -ForegroundColor Red
    exit 1
}

$tauriConfig = Get-Content $tauriConfigPath | ConvertFrom-Json
$currentVersion = $tauriConfig.package.version
$rawProductName = $tauriConfig.package.productName
if ([string]::IsNullOrWhiteSpace($rawProductName)) {
    $rawProductName = "Prophet Kacou"  # fallback si non défini
}
if ([string]::IsNullOrWhiteSpace($currentVersion)) {
    $currentVersion = "1.0.0"  # fallback si non défini
}

$productName = $rawProductName -replace ' ', '_' # remplacer espaces par underscores

# Architectures à builder
$architectures = @("x64", "x86")

# Définir la clé privée de l'updater (remplacez par votre vraie clé privée)
$env:TAURI_SIGNING_PRIVATE_KEY = "~/.tauri/myapp.key"
<# optionally also add a password #>
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD="Bestm@n1995"

Write-Host "Construction de l'application $rawProductName..." -ForegroundColor Blue
cargo tauri build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build reussi! Signature des installeurs MSI..." -ForegroundColor Green
    
    foreach ($arch in $architectures) {
        $msiPath = "src-tauri\target\release\bundle\msi/Prophet Kacou_1.0.0_${arch}_en-US.msi"
        
        if (Test-Path $msiPath) {
            Write-Host "Signature de $msiPath..." -ForegroundColor Yellow
            & "C:\Program Files (x86)\Windows Kits\10\bin\10.0.26100.0\x64\signtool.exe" sign `
              /fd SHA256 `
              /sha1 A3BA69FB02FF50BD335541F7C4743E550033B6D2 `
              /tr http://timestamp.comodoca.com `
              /td SHA256 `
              $msiPath

            if ($LASTEXITCODE -eq 0) {
                Write-Host "Signature réussie pour $msiPath" -ForegroundColor Green
                
                Write-Host "Verification de la signature..." -ForegroundColor Yellow
                & "C:\Program Files (x86)\Windows Kits\10\bin\10.0.26100.0\x64\signtool.exe" verify /pa $msiPath
            } else {
                Write-Host "Erreur lors de la signature de $msiPath!" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "Fichier MSI non trouvé: $msiPath" -ForegroundColor Red
        }
    }

    Write-Host "Processus termine! Vos installeurs MSI sont prêts." -ForegroundColor Green
} else {
    Write-Host "Erreur lors du build!" -ForegroundColor Red
    exit 1
}

# Nettoyer les variables sensibles
$env:TAURI_SIGNING_PRIVATE_KEY=""
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""
