"use client";

import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Shield, 
  Download, 
  Clock,
  PenTool
} from "lucide-react";
import { useState } from "react";
import { sendDocumentForSignature } from "@/app/actions/signatures";

export function ClientDetailView({ client }: { client: any }) {
  const [activeTab, setActiveTab] = useState("synthèse");
  const [isSending, setIsSending] = useState<string | null>(null);
  const tabs = ["synthèse", "documents", "formulaires", "historique"];

  const handleSendSignature = async (documentId: string, docName: string) => {
    setIsSending(documentId);
    const res = await sendDocumentForSignature({
      clientId: client.id,
      documentId,
      title: `Signature de : ${docName}`,
    });
    
    if (res.success) {
      alert("Demande de signature envoyée avec succès via Zoho Sign !");
    } else {
      alert("Erreur : " + res.error);
    }
    setIsSending(null);
  };

  // Helper to extract data from JSON if needed
  const getFormData = (type: string) => {
    const form = client.forms?.find((f: any) => f.type === type);
    return form?.data || {};
  };

  const discoveryData = getFormData("APPEL_DECOUVERTE");

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-stone-900 border border-[#C5A021] rounded-sm flex items-center justify-center">
            <span className="text-xl font-serif font-bold text-white">
              {client.lastName[0]}{client.firstName[0]}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white tracking-tight">
                {client.firstName} {client.lastName}
              </h1>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-full ${
                client.status === 'ACTIVE' ? 'border-green-100 text-green-600 bg-green-50/50' : 
                'border-[#C5A021]/30 text-[#C5A021] bg-[#C5A021]/5'
              }`}>
                {client.status}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
              <Mail className="h-3 w-3" /> {client.email || "Non renseigné"} • <Phone className="h-3 w-3" /> {client.phone || "Non renseigné"}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="text-[10px] font-bold uppercase tracking-widest border border-stone-200 px-4 py-2 hover:bg-stone-50 transition-colors">
            Modifier
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-stone-100 dark:border-stone-900">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? "text-stone-900 dark:text-white" : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C5A021]" />}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "synthèse" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-900 p-6 rounded-sm shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                  <User className="h-4 w-4 text-[#C5A021]" /> Informations Générales
                </h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Situation</label>
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-200 mt-1">{discoveryData.situation || "-"}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Profession</label>
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-200 mt-1">{discoveryData.profession || "-"}</p>
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-900 p-6 rounded-sm shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#C5A021]" /> Objectifs extraits par IA
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 border-l-2 border-[#C5A021]">
                    <p className="text-xs font-medium text-stone-700 dark:text-stone-300">
                      {discoveryData.objectifs || "Aucun objectif extrait pour le moment."}
                    </p>
                  </div>
                </div>
              </section>
            </div>
            
            <div className="space-y-6">
               <div className="bg-stone-900 p-6 rounded-sm border border-[#C5A021]/20">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A021] mb-4">Suivi du dossier</h3>
                 <p className="text-[10px] text-stone-400">Dernière mise à jour : {new Date(client.updatedAt).toLocaleDateString('fr-FR')}</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-900 rounded-sm">
            {client.documents?.length > 0 ? (
               <div className="divide-y divide-stone-50 dark:divide-stone-900">
                 {client.documents.map((doc: any) => (
                   <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-stone-50/50 transition-colors group">
                     <div className="flex items-center gap-3">
                       <FileText className="h-5 w-5 text-stone-400 group-hover:text-[#C5A021]" />
                       <div>
                         <p className="text-sm font-medium text-stone-900">{doc.name}</p>
                         <p className="text-[9px] text-stone-400 uppercase tracking-widest">{doc.type}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <button 
                         onClick={() => handleSendSignature(doc.id, doc.name)}
                         disabled={isSending === doc.id}
                         className="p-2 text-stone-400 hover:text-[#C5A021] transition-colors disabled:opacity-50"
                         title="Envoyer pour signature Zoho Sign"
                       >
                         <PenTool className={`h-4 w-4 ${isSending === doc.id ? 'animate-pulse' : ''}`} />
                       </button>
                       <button className="p-2 text-stone-300 hover:text-stone-900">
                         <Download className="h-4 w-4" />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="p-12 text-center text-stone-400 text-xs font-medium">Aucun document déposé.</div>
            )}
          </div>
        )}

        {activeTab === "historique" && (
          <div className="space-y-4">
            {client.auditLogs?.map((log: any, i: number) => (
              <div key={log.id} className="flex gap-4 items-start relative pb-4">
                <div className="h-4 w-4 rounded-full bg-stone-900 border border-[#C5A021] shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-bold text-stone-900 uppercase tracking-widest">{log.action}</p>
                  <p className="text-[10px] text-stone-400 mt-1">{new Date(log.createdAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
