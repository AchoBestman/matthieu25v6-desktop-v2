use sqlite_blob_reader::get_file_blob;
use std::process::Command;
use tauri::command;
mod download; // 🔥 importer ton fichier download.rs
use download::download_audio;
use download::DownloadManager; // 🔥 importer le gestionnaire de téléchargement
use download::cancel_download; // 🔥 importer la fonction d'annulation

#[command]
fn open_file(path: String) -> Result<(), String> {
    // Match OS at compile time
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

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn fetch_blob(db_path: String, name: String) -> Result<Vec<u8>, String> {
    get_file_blob(&db_path, &name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .manage(DownloadManager::new()) // 🔹 crée un DownloadManager vide avec un Mutex<HashMap> pour stocker les téléchargements et leurs tokens d’annulation`
        .invoke_handler(tauri::generate_handler![greet, fetch_blob, open_file, download_audio, cancel_download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
