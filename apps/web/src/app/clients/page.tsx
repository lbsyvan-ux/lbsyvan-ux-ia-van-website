import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Filter,
  User
} from "lucide-react";
import Link from "next/link";
import { getClients } from "@/app/actions/clients";

export default async function ClientsPage() {
  const response = await getClients();
  const clients = response.success ? response.data : [];

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white tracking-tight">
            Répertoire Clients
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Gérez votre base de clients et accédez à leurs dossiers patrimoniaux.
          </p>
        </div>
        <button className="bg-stone-900 text-white text-xs font-bold px-6 py-3 uppercase tracking-widest hover:bg-[#C5A021] transition-all duration-300 flex items-center gap-2 rounded-sm self-start md:self-auto">
          <Plus className="h-4 w-4" />
          Ajouter un client
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Rechercher un nom, email ou téléphone..."
            className="w-full bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-900 rounded-sm py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#C5A021]/50 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-stone-100 dark:border-stone-900 bg-white dark:bg-stone-950 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors rounded-sm">
          <Filter className="h-4 w-4" />
          Filtres
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-900 rounded-sm shadow-sm overflow-hidden">
        {clients && clients.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-900">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Client</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Statut</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Dernier Contact</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50 dark:divide-stone-900">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-stone-50/30 dark:hover:bg-stone-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/clients/${client.id}`} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center border border-stone-200 dark:border-stone-700">
                        <User className="h-4 w-4 text-stone-400" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-stone-900 dark:text-white group-hover:text-[#C5A021] transition-colors">
                          {client.lastName} {client.firstName}
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      client.status === 'ACTIVE' ? 'border-green-100 text-green-600 bg-green-50/50' : 
                      client.status === 'PROSPECT' ? 'border-[#C5A021]/30 text-[#C5A021] bg-[#C5A021]/5' :
                      'border-stone-200 text-stone-400 bg-stone-50'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500 font-medium">
                    {client.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    {new Date(client.updatedAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors p-1">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center">
            <User className="h-8 w-8 text-stone-200 mx-auto mb-4" />
            <p className="text-sm text-stone-400 font-medium">Aucun client trouvé dans la base.</p>
          </div>
        )}
      </div>
      
      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2">
        <span>Affichage de {clients?.length || 0} clients</span>
        <div className="flex gap-4">
          <button className="hover:text-stone-900 transition-colors">Précédent</button>
          <button className="text-stone-900">1</button>
          <button className="hover:text-stone-900 transition-colors">Suivant</button>
        </div>
      </div>
    </div>
  );
}
