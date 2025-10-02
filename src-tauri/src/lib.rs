use sqlite_blob_reader::get_file_blob;
use std::process::Command;
use tauri::command;
use tauri::{Manager, PhysicalSize, Size}; // 👈 ajouté Size
mod download; // 🔥 importer ton fichier download.rs
use download::DownloadManager; // 🔥 importer le gestionnaire de téléchargement
use download::cancel_download;
use download::download_audio;
use std::fs;
use std::path::PathBuf;
use tauri::path::BaseDirectory;

#[command]
fn open_file(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(&["/C", "start", "", &path])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn fetch_blob(db_path: String, name: String) -> Result<Vec<u8>, String> {
    get_file_blob(&db_path, &name)
}

fn run_migration_if_needed(app: &tauri::App) -> tauri::Result<()> {
    let current_version = app.package_info().version.to_string();
    let app_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get app data dir");
    fs::create_dir_all(&app_dir).unwrap();
    let version_file = app_dir.join("version.txt");

    let mut should_run = false;

    if !version_file.exists() {
        // première installation
        println!("app run for the first time");
        should_run = true;
    } else {
        let saved_version = fs::read_to_string(&version_file).unwrap_or_default();
        if saved_version.trim() != current_version {
            // mise à jour détectée
            println!("app is updated because version change");
            should_run = true;
        } else {
            println!("app start not for first time nor update time");
        }
    }

    if should_run {
        let locales = ["fr", "en", "es", "pt"];
        for locale in locales {
            let target_dir = app_dir.join(locale);
            fs::create_dir_all(&target_dir).unwrap();

            let dest_path = target_dir.join(format!("matth25v6_{}.db", locale));

            // 🔹 Si le fichier existe déjà, on le supprime
            if dest_path.exists() {
                fs::remove_file(&dest_path).expect("Failed to remove old database");
            }

            // Copier la nouvelle base depuis les ressources
            let resource_path: PathBuf = app
                .path()
                .resolve(
                    format!("resources/{}/matth25v6_{}.db", locale, locale),
                    BaseDirectory::Resource,
                )
                .expect("Failed to resolve resource");

            fs::copy(&resource_path, &dest_path).expect("Failed to copy new database");
        }

        // Mettre à jour version.txt avec la version actuelle
        fs::write(&version_file, &current_version).unwrap();
    }

    println!("should run {}", should_run);
    Ok(())
}

fn set_app_size_on_run_time(app: &tauri::App) -> tauri::Result<()> {
    let primary_monitor = app.app_handle().primary_monitor()?.unwrap();
    let monitor_size = primary_monitor.size();

    let width = (monitor_size.width as f64 * 0.9) as u32; // 80%
    let height = (monitor_size.height as f64 * 0.9) as u32; // 90%

    let min_width = (monitor_size.width as f64 * 0.9) as u32; // 90%
    let min_height = (monitor_size.height as f64 * 0.9) as u32; // 90%

    if let Some(window) = app.get_webview_window("main") {
        // Appliquer la taille par défaut
        window.set_size(Size::Physical(PhysicalSize { width, height }))?;

        // Définir une taille minimale
        window.set_min_size(Some(Size::Physical(PhysicalSize {
            width: min_width,
            height: min_height,
        })))?;

        // Calculer le centrage
        let x = ((monitor_size.width as i32 - width as i32) / 2).max(0);
        let y = ((monitor_size.height as i32 - height as i32) / 2).max(0);

        window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x, y }))?;
    }
    // 🔹 IMPORTANT : retourne Ok(()) pour respecter le type
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .manage(DownloadManager::new()) // 🔹 crée un DownloadManager vide avec un Mutex<HashMap>
        .invoke_handler(tauri::generate_handler![
            greet,
            fetch_blob,
            open_file,
            download_audio,
            cancel_download
        ])
        .setup(|app| {
            // fixation de la taille de l,ecran par défaut
            set_app_size_on_run_time(app)?;
            run_migration_if_needed(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
