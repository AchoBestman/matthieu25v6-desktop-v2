# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

## Default color: bg-amber-800 text-amber-800

## rustup update stable if get he package requires the Cargo feature called `edition2024`

## Translate language
français(fr), anglaise(en), arabe(ar), allemand(de), espagnole(es), iran(fa), hindi(hi), Indonesia(id), italien(it), japan(ja), Netherlands(nl), Norsk(no), Polski(pl), portugais(pt), Româna(ro), russe(ru), Talmud(ta), Mandarin(zh), Türkçe(tr)

## Artifat Building

While building your update artifacts, you need to have the private key you generated in your environment variables. .env files do not work!

1. Mac/Linux
    export TAURI_SIGNING_PRIVATE_KEY="Path or content of your private key"
    # optionally also add a password
    export TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""

2. Windows
    Run this in PowerShell:

    $env:TAURI_SIGNING_PRIVATE_KEY="Path or content of your private key"
    <# optionally also add a password #>
    $env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""


# Using Docker Compose directly
docker compose -f docker-compose.x86_64.yml up --build

# Or using the build script
./build.sh x86_64

AppImage (artifacts/appimage/) - Universal Linux executable
DEB (artifacts/deb/) - Debian/Ubuntu package
RPM (artifacts/rpm/) - RedHat/CentOS/Fedora package