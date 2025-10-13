use serde::Serialize;
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
use regex::Regex;

#[derive(Serialize)]
pub struct DbInfo {
    subdir: String,
    lang: String,
    dbname: String,
    dbpath: String,
    is_common: bool,
}


#[command]
fn resolve_db_info(
    initial: String,
    is_common: bool,
    app_db_name: String,
    common_db_name: String,
) -> Result<DbInfo, String> {
    let re = Regex::new(r"^[A-Za-z]{2}-[A-Za-z]{2,4}$").unwrap();

    if !re.is_match(&initial) {
        return Err(format!(
            "Invalid format: {} must be in the format 'AA-AA{{BC}}'",
            initial
        ));
    }
    

    let parts: Vec<&str> = initial.split('-').collect();
    let country = parts[0].to_lowercase();
    let lang = parts[1].to_lowercase();

    let dbpath = if is_common {
        format!("common/{}.db", common_db_name)
    } else {
        format!("{}/{}_{}.db", country, app_db_name, lang)
    };

    let subdir = if is_common {
        "common".to_string()
    } else {
        country.to_lowercase()
    };

    let dbname = if is_common {
        format!("{}.db", common_db_name)
    } else {
        format!("{}_{}.db", app_db_name, lang)
    };

    Ok(DbInfo {
        subdir,
        lang,
        dbpath,
        dbname,
        is_common
    })
}

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
    let app_dir = match app.path().app_data_dir() {
        Ok(dir) => dir,
        Err(e) => {
            println!("⚠️ Failed to get app data dir: {}, skipping migration", e);
            return Ok(());
        }
    };

    fs::create_dir_all(&app_dir).ok();
    let version_file = app_dir.join("version.txt");

    let mut should_run = false;

    if !version_file.exists() {
        println!("🆕 App run for the first time");
        should_run = true;
    } else {
        let saved_version = fs::read_to_string(&version_file).unwrap_or_default();
        if saved_version.trim() != current_version {
            println!("⬆️ App updated (version changed)");
            should_run = true;
        } else {
            println!("🔁 App started normally (no migration needed)");
        }
    }

    if should_run {
        // 🔹 1. Copier les bases locales (fr, en, es, pt)
        let locales = ["fr", "en", "es", "pt"];
        for locale in locales {
            let target_dir = app_dir.join(locale);
            fs::create_dir_all(&target_dir).ok();

            let dest_path = target_dir.join(format!("matth25v6_{}.db", locale));

            if dest_path.exists() {
                fs::remove_file(&dest_path).ok();
            }

            let resource_path: PathBuf = match app
                .path()
                .resolve(
                    format!("resources/{}/matth25v6_{}.db", locale, locale),
                    BaseDirectory::Resource,
                ) {
                Ok(path) => path,
                Err(_) => {
                    println!("⚠️ Resource for locale '{}' not found, skipping", locale);
                    continue; // ignore missing locale db
                }
            };

            if let Err(e) = fs::copy(&resource_path, &dest_path) {
                println!("⚠️ Failed to copy {}: {}", resource_path.display(), e);
            }
        }

        // 🔹 2. Copier la base commune common.db
        let common_dir = app_dir.join("common");
        fs::create_dir_all(&common_dir).ok();

        let common_dest = common_dir.join("common.db");

        if common_dest.exists() {
            fs::remove_file(&common_dest).ok();
        }

        let common_source: PathBuf = match app
            .path()
            .resolve("resources/common/common.db", BaseDirectory::Resource)
        {
            Ok(path) => path,
            Err(_) => {
                println!("⚠️ common.db resource not found, skipping common database");
                return Ok(()); // ignore if common.db missing
            }
        };

        if let Err(e) = fs::copy(&common_source, &common_dest) {
            println!("⚠️ Failed to copy common.db: {}", e);
        }

        // 🔹 3. Mettre à jour version.txt
        if let Err(e) = fs::write(&version_file, &current_version) {
            println!("⚠️ Failed to update version.txt: {}", e);
        }

        println!("✅ Databases migrated successfully!");
    }

    println!("should run migration: {}", should_run);
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
            cancel_download,
            resolve_db_info
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
