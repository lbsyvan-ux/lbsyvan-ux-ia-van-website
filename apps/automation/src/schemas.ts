import { z } from "zod";

/**
 * Schéma de données extrait de l'appel découverte
 * Garantit que l'IA renvoie un format prévisible pour le CRM
 */
export const DiscoveryFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  situation: z.string().describe("Situation familiale et matrimoniale"),
  profession: z.string().describe("Métier et situation professionnelle"),
  revenus: z.string().optional().describe("Revenus annuels ou mensuels mentionnés"),
  patrimoine: z.string().optional().describe("Actifs déjà possédés (immobilier, bourse, etc.)"),
  objectifs: z.string().describe("Objectifs patrimoniaux (retraite, transmission, etc.)"),
  pointsDattention: z.string().optional().describe("Risques ou contraintes spécifiques"),
});

export type DiscoveryForm = z.infer<typeof DiscoveryFormSchema>;

export const PROMPT_EXTRACTION = `
Tu es un assistant expert en gestion de patrimoine pour le cabinet Kapex Wealth Management.
Ta mission est d'extraire les informations clés d'une transcription d'appel découverte entre un conseiller et son client.

Instructions :
1. Sois précis et factuel.
2. Si une information n'est pas mentionnée, laisse le champ vide.
3. Synthétise les objectifs du client de manière professionnelle.
4. Identifie les membres de la famille si mentionnés.

Format de sortie : JSON strict uniquement.
`;
