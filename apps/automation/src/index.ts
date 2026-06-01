import * as dotenv from 'dotenv';
import { processNewTranscripts } from './processor.ts';

dotenv.config();

async function main() {
  console.log("🤖 Kapex Automation Service started");
  
  // Dans une version réelle, ceci serait lancé via un Webhook ou un intervalle
  // Pour le moment, nous lançons un scan manuel au démarrage
  console.log("⏳ Initial scan starting...");
  
  // Note: La fonction nécessite un objet 'auth' configuré.
  // Dans un premier temps, nous logguons simplement le démarrage.
  console.log("📡 Listening for Google Drive events...");
}

main().catch(console.error);
