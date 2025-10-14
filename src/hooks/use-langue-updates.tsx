import { useLangue } from "@/context/langue-context";
import {
  availableServerLanguesUpdates
} from "@/lib/db-updates";
import { availableServerNotifications } from "@/lib/notifications";
import { AppDatabaseDir } from "@/lib/utils";
import { readDir } from "@tauri-apps/plugin-fs";
import { useEffect } from "react";

export async function getAvailableLangs(): Promise<string[]> {
  try {
    // Lire le dossier racine de l'app data
    const entries = await readDir("", { baseDir: AppDatabaseDir });
    const langs: string[] = [];

    for (const entry of entries) {
      // On ignore les fichiers directs et le dossier "common"
      if (!entry.name || entry.name === "common" || !entry.isDirectory)
        continue;

      // Lire les fichiers à l'intérieur du dossier
      const files = await readDir(entry.name, { baseDir: AppDatabaseDir });

      // Vérifier si au moins un fichier .db existe
      const hasDb = files.some((f) => f.name?.endsWith(".db"));
      if (!hasDb) continue;

      // Exemple : dossier "en" → fichier "matth25v6_en.db"
      const folder = entry.name; // ex: "en" ou "ci"

      // Trouver le code langue à partir du fichier
      for (const file of files) {
        if (!file.isFile) continue;

        const fileName = file.name ?? "";
        const match = fileName.match(/matth25v6_([a-z]+)\.db$/i);

        if (match) {
          const langCode = match[1]; // ex: en, fr, abi...
          langs.push(`${folder}-${langCode}`);
        }
      }
    }

    return langs;
  } catch (err) {
    console.error("Erreur lors de la récupération des langues :", err);
    return [];
  }
}

function useLangueUpdates() {
  const { lng } = useLangue();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const langs = await getAvailableLangs();
        availableServerNotifications(lng, langs).catch(err=> console.log(err));
        availableServerLanguesUpdates(lng, langs).catch(err=> console.log(err));
      } catch (err: any) {
        console.error("Error fetching updates:", err);
      } finally {
      }
    };

    fetchUpdates();
  }, [lng]);
}

export default useLangueUpdates;
