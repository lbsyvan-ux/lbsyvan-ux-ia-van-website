import { PrismaClient, Role, ClientStatus, FormStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // 1. Create a dummy Advisor (User)
  const advisor = await prisma.user.upsert({
    where: { email: "admin@kapex.fr" },
    update: {},
    create: {
      email: "admin@kapex.fr",
      name: "Conseiller Kapex",
      role: Role.ADVISOR,
    },
  });

  console.log(`Created advisor: ${advisor.name}`);

  // 2. Create some Clients
  const clientsData = [
    {
      firstName: "Jean-Pierre",
      lastName: "Martin",
      email: "jp.martin@email.com",
      phone: "0612345678",
      status: ClientStatus.ACTIVE,
    },
    {
      firstName: "Sophie",
      lastName: "Laurent",
      email: "s.laurent@outlook.fr",
      phone: "0788990011",
      status: ClientStatus.PROSPECT,
    },
    {
      firstName: "Marc",
      lastName: "Aubert",
      email: "m.aubert@gmail.com",
      phone: "0655443322",
      status: ClientStatus.LEAD,
    },
  ];

  for (const clientInfo of clientsData) {
    const client = await prisma.client.create({
      data: {
        ...clientInfo,
        advisorId: advisor.id,
        // Add a first audit log for creation
        auditLogs: {
          create: {
            action: "CLIENT_CREATED",
            entityType: "Client",
            userId: advisor.id,
            details: { info: "Initial creation via seeding" },
          },
        },
        // Add a dummy form for the first one
        ...(clientInfo.lastName === "Martin" ? {
          forms: {
            create: {
              type: "APPEL_DECOUVERTE",
              status: FormStatus.VALIDATED,
              data: {
                situation: "Marié, 2 enfants",
                profession: "Directeur Financier",
                objectifs: "Préparation retraite, transmission",
              },
            },
          },
        } : {}),
      },
    });
    console.log(`Created client: ${client.firstName} ${client.lastName}`);
  }

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
