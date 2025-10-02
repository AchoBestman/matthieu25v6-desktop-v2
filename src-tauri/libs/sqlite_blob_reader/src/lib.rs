
use rusqlite::{types::ValueRef, Connection};

pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

pub fn get_file_blob(db_path: &str, name: &str) -> Result<Vec<u8>, String> {
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT file FROM image_sermons WHERE name = ?1")
        .map_err(|e| e.to_string())?;
    let mut rows = stmt.query([name]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        let val = row.get_ref(0).map_err(|e| e.to_string())?;
        let blob = match val {
            ValueRef::Blob(b) => b.to_vec(),
            ValueRef::Text(t) => t.to_vec(), // prend les octets bruts même si SQLite pense que c’est Text
            _ => return Err("Unsupported type".into()),
        };
        println!("Fetched blob for {}: {} bytes", name, blob.len());
        Ok(blob)
    } else {
        Err("Not found".into())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
