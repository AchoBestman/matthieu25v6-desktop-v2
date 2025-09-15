use futures_util::StreamExt;
use reqwest::Client;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;
use tauri::{AppHandle, Emitter};
use tokio_util::sync::CancellationToken;
use serde::Serialize;
use std::collections::HashMap;
use std::sync::Mutex;
use std::path::PathBuf;
use tokio::fs;

#[derive(Serialize, Clone)]
#[serde(rename_all = "PascalCase")]
pub enum DownloadStatus {
    Downloading,
    Completed,
    Failed(String),
    Cancelled,
}

#[derive(Serialize, Clone)]
pub struct DownloadProgress {
    pub id: String,
    pub file_path: String,
    pub percent: f64,
    pub downloaded_mb: f64,
    pub total_mb: f64,
    pub status: DownloadStatus, // état actuel
}

pub struct DownloadManager {
    pub tasks: Mutex<HashMap<String, CancellationToken>>,
}

impl DownloadManager {
    //constructor, don't forget to initialize in main.rs
    pub fn new() -> Self {
        Self { tasks: Mutex::new(HashMap::new()) }
    }

    pub fn add_task(&self, id: String, token: CancellationToken) {
        self.tasks.lock().unwrap().insert(id, token);
    }

    pub fn cancel_task(&self, id: &str) {
        if let Some(token) = self.tasks.lock().unwrap().remove(id) {
            token.cancel();
        }
    }
}

#[tauri::command]
pub async fn download_audio(
    id: String,
    url: String,
    file_full_path: String, // chemin complet fourni par React
    app_handle: AppHandle,
    manager: tauri::State<'_, DownloadManager>,
) -> Result<DownloadProgress, String> {
    

    let cancel_token = CancellationToken::new();
    manager.add_task(id.clone(), cancel_token.clone());

    let client = Client::new();
    let res = client.get(&url).send().await.map_err(|e| e.to_string())?;
    if !res.status().is_success() {
        manager.cancel_task(&id);
        let progress = DownloadProgress {
            id,
            file_path: PathBuf::from(&file_full_path).file_name().unwrap().to_string_lossy().to_string(),
            percent: 0.0,
            downloaded_mb: 0.0,
            total_mb: 0.0,
            status: DownloadStatus::Failed(format!("Upstream error: {}", res.status())),
        };
        app_handle.emit("download_progress", Some(progress)).unwrap();
        return Err("Upstream error".into());
    }

    let total = res.content_length().unwrap_or(0);
    let total_mb = total as f64 / (1024.0 * 1024.0);
    let mut received: u64 = 0;

    // --- chemin temporaire ---
    let final_path = PathBuf::from(&file_full_path);
    let mut temp_path = final_path.clone();
    temp_path.set_extension("tmp"); // track.mp3.tmp

    let mut file = File::create(&temp_path).await.map_err(|e| e.to_string())?;
    let mut stream = res.bytes_stream();

    while let Some(chunk) = stream.next().await {
        if cancel_token.is_cancelled() {
            let progress = DownloadProgress {
                id: id.clone(),
                file_path: final_path.file_name().unwrap().to_string_lossy().to_string(),
                percent: (received as f64 / total as f64) * 100.0,
                downloaded_mb: received as f64 / (1024.0 * 1024.0),
                total_mb,
                status: DownloadStatus::Cancelled,
            };
            app_handle.emit("download_progress", Some(progress)).unwrap();

            // Supprimer le fichier temporaire en cas d'annulation
            let _ = fs::remove_file(&temp_path).await;

            return Err("Download cancelled".into());
        }

        let data = chunk.map_err(|e| e.to_string())?;
        received += data.len() as u64;
        file.write_all(&data).await.map_err(|e| e.to_string())?;

        let progress = DownloadProgress {
            id: id.clone(),
            file_path: final_path.file_name().unwrap().to_string_lossy().to_string(),
            percent: (received as f64 / total as f64) * 100.0,
            downloaded_mb: received as f64 / (1024.0 * 1024.0),
            total_mb,
            status: DownloadStatus::Downloading,
        };
        app_handle.emit("download_progress", Some(progress)).unwrap();
    }

    file.flush().await.map_err(|e| e.to_string())?;

    // --- remplacer l'ancien fichier par le nouveau ---
    fs::rename(&temp_path, &final_path)
        .await
        .map_err(|e| e.to_string())?;

    manager.cancel_task(&id);

    let progress = DownloadProgress {
        id,
        file_path: final_path.file_name().unwrap().to_string_lossy().to_string(),
        percent: 100.0,
        downloaded_mb: total_mb,
        total_mb,
        status: DownloadStatus::Completed,
    };
    app_handle.emit("download_progress", Some(progress.clone())).unwrap();

    Ok(progress)
}


#[tauri::command]
pub fn cancel_download(id: String, manager: tauri::State<'_, DownloadManager>) -> bool {
    println!("Trying to cancel: {}", id);
    let tasks = manager.tasks.lock().unwrap();
    println!("Current tasks: {:?}", tasks.keys().collect::<Vec<_>>());
    if tasks.contains_key(&id) {
        drop(tasks); // unlock before cancel
        manager.cancel_task(&id);
        true
    } else {
        false
    }
}

