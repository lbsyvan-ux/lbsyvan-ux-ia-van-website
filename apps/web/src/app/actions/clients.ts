"use server";

import { db } from "@/lib/db";

export async function getClients() {
  try {
    const clients = await db.client.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        advisor: {
          select: { name: true }
        }
      }
    });
    return { success: true, data: clients };
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return { success: false, error: "Erreur lors de la récupération des clients" };
  }
}

export async function getClientById(id: string) {
  try {
    const client = await db.client.findUnique({
      where: { id },
      include: {
        forms: true,
        documents: true,
        auditLogs: {
          orderBy: { createdAt: "desc" }
        }
      }
    });
    return { success: true, data: client };
  } catch (error) {
    console.error("Failed to fetch client:", error);
    return { success: false, error: "Erreur lors de la récupération du dossier client" };
  }
}
