import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { FileText, FileSpreadsheet, Presentation, Download, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type TipoArquivo = "PDF" | "Planilha" | "Apresentação";

interface Documento {
  id: string;
  nome: string;
  tipo: TipoArquivo;
  categoria: string;
  tamanho: string;
  data: string;
}

const mock: Documento[] = [
  {
    id: "d1",
    nome: "Manual do Colaborador 2025",
    tipo: "PDF",
    categoria: "Políticas",
    tamanho: "2,4 MB",
    data: "2025-01-10",
  },
  {
    id: "d2",
    nome: "Política de Trabalho Remoto",
    tipo: "PDF",
    categoria: "Políticas",
    tamanho: "840 KB",
    data: "2025-03-01",
  },
  {
    id: "d3",
    nome: "Headcount e Orçamento RH 2025",
    tipo: "Planilha",
    categoria: "Relatórios",
    tamanho: "1,1 MB",
    data: "2025-01-20",
  },
  {
    id: "d4",
    nome: "Resultados da Pesquisa de Clima Q1",
    tipo: "Apresentação",
    categoria: "Relatórios",
    tamanho: "5,8 MB",
    data: "2025-04-08",
  },
  {
    id: "d5",
    nome: "Plano de Cargos e Salários",
    tipo: "Planilha",
    categoria: "Remuneração",
    tamanho: "620 KB",
    data: "2025-02-14",
  },
  {
    id: "d6",
    nome: "Acordo Coletivo de Trabalho 2025",
    tipo: "PDF",
    categoria: "Jurídico",
    tamanho: "1,7 MB",
    data: "2025-03-22",
  },
];

const tipoConfig: Record<TipoArquivo, { icon: LucideIcon; cls: string }> = {
  PDF:          { icon: FileText,         cls: "text-red-500 bg-red-500/10" },
  Planilha:     { icon: FileSpreadsheet,  cls: "text-emerald-500 bg-emerald-500/10" },
  Apresentação: { icon: Presentation,     cls: "text-blue-500 bg-blue-500/10" },
};

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function ClienteDocumentosPage() {
  const categorias = [...new Set(mock.map((d) => d.categoria))];

  return (
    <div>
      <PageHeader
        title="Documentos"
        subtitle="Arquivos e documentos compartilhados pela Azumi com sua empresa."
      />

      {mock.length === 0 ? (
        <div className="bg-card border border-border rounded-xl">
          <EmptyState
            icon={FolderOpen}
            title="Nenhum documento"
            description="Os documentos da sua empresa ainda estão sendo preparados."
          />
        </div>
      ) : (
        <div className="space-y-6">
          {categorias.map((cat) => (
            <div key={cat} className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{cat}</span>
              </div>
              <ul className="divide-y divide-border">
                {mock.filter((d) => d.categoria === cat).map((doc) => {
                  const { icon: Icon, cls } = tipoConfig[doc.tipo];
                  return (
                    <li key={doc.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-secondary/20 transition-colors">
                      <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", cls)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.nome}</p>
                        <p className="text-xs text-muted-foreground">{doc.tipo} · {doc.tamanho} · {formatarData(doc.data)}</p>
                      </div>
                      <button
                        className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary/50"
                        onClick={() => {/* TODO: download real */}}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Baixar
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
