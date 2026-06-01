import { getClientById } from "@/app/actions/clients";
import { ClientDetailView } from "@/components/clients/ClientDetailView";
import { notFound } from "next/navigation";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getClientById(id);

  if (!response.success || !response.data) {
    return notFound();
  }

  const client = response.data;

  return <ClientDetailView client={client} />;
}
