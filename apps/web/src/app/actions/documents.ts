"use server";

import { db } from "@/lib/db";
import { getUploadUrl, getDownloadUrl } from "@/lib/s3";
import { revalidatePath } from "next/cache";

export async function generateUploadUrl(clientId: string, fileName: string, fileType: string) {
  try {
    const { url, key } = await getUploadUrl(fileName, fileType);
    
    // On enregistre le document en base avec un statut "En attente d'upload"
    // ou on attend que l'upload soit fini côté client pour l'enregistrer.
    // Option plus simple : on renvoie juste l'URL et le client nous rappelle après.
    
    return { success: true, url, key };
  } catch (error) {
    console.error("S3 Upload URL Error:", error);
    return { success: false, error: "Impossible de générer l'URL d'upload" };
  }
}

export async function confirmUpload(clientId: string, key: string, name: string, type: string) {
  try {
    const document = await db.document.create({
      data: {
        clientId,
        url: key, // On stocke la clé S3, pas l'URL complète
        name,
        type,
      }
    });

    revalidatePath(`/clients/${clientId}`);
    return { success: true, data: document };
  } catch (error) {
    console.error("Confirm Upload Error:", error);
    return { success: false, error: "Erreur lors de l'enregistrement du document" };
  }
}

export async function getSecureDownloadUrl(key: string) {
  try {
    const url = await getDownloadUrl(key);
    return { success: true, url };
  } catch (error) {
    return { success: false, error: "Impossible de récupérer le lien de téléchargement" };
  }
}
