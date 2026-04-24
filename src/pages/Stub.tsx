import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Construction } from "lucide-react";

interface StubProps {
  title: string;
  subtitle?: string;
  desc?: string;
}

export default function Stub({ title, subtitle, desc }: StubProps) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="bg-card border border-border rounded-xl">
        <EmptyState
          icon={Construction}
          title="Em construção"
          description={desc ?? "Esta área está sendo finalizada. O layout, navegação e tokens já seguem o design system Azumi."}
        />
      </div>
    </div>
  );
}
