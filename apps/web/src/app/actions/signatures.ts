"use server";

import { db } from "@/lib/db";
import { createZohoSignatureRequest } from "@/lib/zohosign";
import { getDownloadUrl } from "@/lib/s3";
import axios from "axios";
import { revalidatePath } from "next/cache";

export async function sendDocumentForSignature(params: {
  clientId: string;
  documentId: string;
  title: string;
}) {
  try {
    // 1. Récupérer les infos du client et du document
    const client = await db.client.findUnique({
      where: { id: params.clientId },
      include: { advisor: true }
    });

    const document = await db.document.findUnique({
      where: { id: params.documentId }
    });

    if (!client || !document) {
      return { success: false, error: "Client ou document introuvable" };
    }

    if (!client.email) {
      return { success: false, error: "Le client n'a pas d'adresse email renseignée" };
    }

    // 2. Récupérer le contenu du fichier depuis S3
    const s3Url = await getDownloadUrl(document.url);
    const fileResponse = await axios.get(s3Url, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(fileResponse.data);

    // 3. Envoyer à Zoho Sign
    console.log(`📡 Envoi du document ${document.name} à Zoho Sign pour ${client.email}...`);
    
    const result = await createZohoSignatureRequest({
      title: params.title,
      clientEmail: client.email,
      clientName: `${client.firstName} ${client.lastName}`,
      fileBuffer: fileBuffer,
      fileName: document.name,
    });

    if (result.success) {
      // 4. Enregistrer dans la piste d'audit
      await db.auditLog.create({
        data: {
          action: "SIGNATURE_REQUEST_SENT",
          entityId: document.id,
          entityType: "Document",
          clientId: client.id,
          userId: client.advisorId,
          details: { 
            zohoRequestId: result.requestId,
            documentName: document.name 
          }
        }
      });

      revalidatePath(`/clients/${client.id}`);
      return { success: true, requestId: result.requestId };
    } else {
      return { success: false, error: result.error };
    }

  } catch (error: any) {
    console.error("Signature Action Error:", error);
    return { success: false, error: "Erreur lors de l'envoi pour signature" };
  }
}
