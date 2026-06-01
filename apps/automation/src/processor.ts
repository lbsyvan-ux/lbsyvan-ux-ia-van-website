import { google } from 'googleapis';
import { PrismaClient, FormStatus } from '@crm/database';
import { DiscoveryFormSchema, PROMPT_EXTRACTION } from './schemas.ts';
import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Service de scan et d'analyse des transcriptions Google Drive
 */
export async function processNewTranscripts(auth: any) {
  const drive = google.drive({ version: 'v3', auth });
  
  try {
    // 1. Rechercher les fichiers récents dont le nom contient "appel découverte"
    const response = await drive.files.list({
      q: "name contains 'appel découverte' and mimeType = 'application/vnd.google-apps.document'",
      fields: 'files(id, name, createdTime)',
      orderBy: 'createdTime desc',
    });

    const files = response.data.files || [];
    console.log(`🔍 Trouvé ${files.length} fichiers correspondant aux critères.`);

    for (const file of files) {
      if (!file.id || !file.name) continue;

      // 2. Vérifier si ce fichier a déjà été traité (Idempotence)
      const existingForm = await prisma.form.findFirst({
        where: { 
          data: {
            path: ['googleFileId'],
            equals: file.id
          } as any
        }
      });

      if (existingForm) {
        console.log(`⏭️ Fichier déjà traité : ${file.name}`);
        continue;
      }

      console.log(`🚀 Traitement de : ${file.name}`);

      // 3. Lire le contenu du Google Doc (Transcription)
      const docResponse = await drive.files.export({
        fileId: file.id,
        mimeType: 'text/plain',
      });
      const transcriptText = docResponse.data as string;

      // 4. Envoyer à Claude pour extraction
      console.log(`🧠 Analyse par Claude (Anthropic) en cours...`);
      
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 4096,
        system: PROMPT_EXTRACTION + "\nTu dois impérativement répondre au format JSON sans aucun texte avant ou après.",
        messages: [
          { role: "user", content: `Voici la transcription de l'appel :\n\n${transcriptText}` }
        ],
      });

      // Extraction du texte de la réponse (Claude renvoie un tableau de blocs de contenu)
      const contentText = message.content[0].type === 'text' ? message.content[0].text : '';
      
      let rawAiData;
      try {
        rawAiData = JSON.parse(contentText || '{}');
      } catch (e) {
        console.error("❌ Erreur de parsing JSON de la réponse Claude :", contentText);
        continue;
      }
      
      // 5. Valider les données via Zod
      const validatedData = DiscoveryFormSchema.safeParse(rawAiData);

      if (!validatedData.success) {
        console.error(`❌ Erreur de validation IA pour ${file.name}:`, validatedData.error);
        continue;
      }

      // 6. Enregistrer dans le CRM comme "Brouillon" (Draft)
      await prisma.form.create({
        data: {
          type: "APPEL_DECOUVERTE",
          status: FormStatus.DRAFT,
          data: {
            ...validatedData.data,
            googleFileId: file.id,
            transcriptName: file.name,
            analyzedAt: new Date().toISOString()
          },
          clientId: "ID_TEMPORAIRE_OU_RECHERCHE", 
        }
      });

      console.log(`✅ Formulaire généré pour ${file.name}`);
    }

  } catch (error) {
    console.error("❌ Erreur lors du scan Drive :", error);
  }
}
