import { 
  Users, 
  FileText, 
  Clock, 
  ArrowUpRight,
  UserPlus
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Bienvenue sur votre espace de gestion Kapex. Voici l'état de votre activité.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Clients Actifs", value: "42", icon: Users, color: "text-[#C5A021]" },
          { label: "Formulaires en attente", value: "12", icon: FileText, color: "text-stone-900" },
          { label: "Transcriptions à traiter", value: "3", icon: Clock, color: "text-[#C5A021]" },
          { label: "Signatures en cours", value: "8", icon: ArrowUpRight, color: "text-stone-900" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-stone-950 p-6 border border-stone-100 dark:border-stone-900 rounded-sm shadow-sm hover:border-[#C5A021]/30 transition-colors">
            <div className="flex justify-between items-start">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter">Live</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-stone-900 dark:text-white">{stat.value}</h3>
              <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Section: Activity & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Activity Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-900 rounded-sm shadow-sm">
            <div className="p-6 border-b border-stone-100 dark:border-stone-900 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-white">
                Derniers Appels Découverte
              </h3>
              <button className="text-[10px] font-bold text-[#C5A021] uppercase border border-[#C5A021]/20 px-3 py-1 hover:bg-[#C5A021]/5 transition-colors">
                Tout voir
              </button>
            </div>
            <div className="divide-y divide-stone-50 dark:divide-stone-900">
              {[
                { name: "Jean-Pierre Martin", date: "Il y a 2h", status: "Prêt à traiter", priority: "High" },
                { name: "Sophie Laurent", date: "Hier, 17:30", status: "Transcrit", priority: "Medium" },
                { name: "Marc Aubert", date: "23 Oct.", status: "Terminé", priority: "Low" },
              ].map((item) => (
                <div key={item.name} className="p-4 flex items-center justify-between hover:bg-stone-50/50 dark:hover:bg-stone-900/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-stone-50 dark:bg-stone-900 rounded-full flex items-center justify-center border border-stone-100 dark:border-stone-800">
                      <span className="text-xs font-bold text-stone-400">{item.name[0]}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900 dark:text-white">{item.name}</h4>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wide font-medium">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border ${
                      item.status === 'Prêt à traiter' ? 'border-[#C5A021] text-[#C5A021]' : 'border-stone-200 text-stone-400'
                    }`}>
                      {item.status}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-stone-300 group-hover:text-[#C5A021] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-stone-900 p-6 rounded-sm border border-[#C5A021]/20 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A021] mb-4">
              Action Rapide
            </h3>
            <button className="w-full bg-white text-stone-900 text-xs font-bold py-3 uppercase tracking-widest hover:bg-[#C5A021] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" />
              Nouveau Client
            </button>
            <p className="text-[10px] text-stone-500 mt-4 text-center italic">
              "La gestion de patrimoine est une affaire de confiance et de précision."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
