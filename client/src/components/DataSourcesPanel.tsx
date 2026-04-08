import { dataSources } from "@/lib/permit-data";
import { Badge } from "@/components/ui/badge";
import { Database, ExternalLink, Globe, Server } from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  "ArcGIS REST": Server,
  "GeoJSON": Database,
  "Feature Service": Database,
  "Open Data Portal": Globe,
};

export default function DataSourcesPanel() {
  return (
    <div data-testid="data-sources-panel" className="scroll-with-tab-bar">
      {/* Header */}
      <div className="mobile-header sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary shrink-0" />
          <h1 className="text-base font-semibold text-foreground">Data Sources</h1>
        </div>
        <Badge variant="secondary" className="text-[10px]">{dataSources.length} APIs</Badge>
      </div>

      {/* Intro */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Active OpenData APIs and GeoJSON endpoints powering this tool. Tap any source to view it directly.
        </p>
      </div>

      {/* Source list */}
      <div className="px-4 space-y-2.5 pb-4">
        <p className="section-header px-0 pt-2 pb-1">Live Data Feeds</p>
        {dataSources.map((source, i) => {
          const Icon = typeIcons[source.type] || Globe;
          return (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card card-pressable block"
              data-testid={`data-source-${i}`}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "hsl(var(--primary) / 0.1)" }}
              >
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground leading-tight">
                    {source.name}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                  {source.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                    {source.type}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{source.coverage}</span>
                  <span className="text-[10px] text-muted-foreground">· {source.updateFrequency}</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mx-4 mb-4 p-3.5 rounded-2xl bg-muted/40 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Data Accuracy Notice:</span>{" "}
          Fee and permit information is for reference only. Always confirm with your county's official
          building department before submitting applications. Fees change periodically.
        </p>
      </div>
    </div>
  );
}
