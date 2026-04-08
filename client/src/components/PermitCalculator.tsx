import { useState } from "react";
import { projectTypes, counties, type County } from "@/lib/permit-data";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Lightbulb,
  ExternalLink,
  MapPin,
} from "lucide-react";

interface Props {
  selectedCounty: string;
  onCountyChange: (county: string) => void;
}

export default function PermitCalculator({ selectedCounty, onCountyChange }: Props) {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(
    new Set(["permits", "fees", "inspections", "tips"])
  );

  const project = projectTypes.find((p) => p.id === selectedProject);
  const county = counties.find((c) => c.id === selectedCounty);
  const fees = project && selectedCounty ? project.feesByCounty[selectedCounty] : null;

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Max fee across all counties for bar chart scaling
  const maxFeeAcrossCounties = project
    ? Math.max(
        ...counties
          .filter((c) => project.feesByCounty[c.id])
          .map((c) => project.feesByCounty[c.id].max),
        1
      )
    : 1;

  return (
    <div data-testid="permit-calculator" className="scroll-with-tab-bar">
      {/* Sticky header */}
      <div className="mobile-header sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary shrink-0" />
          <h1 className="text-base font-semibold text-foreground">Permit Calculator</h1>
        </div>
        <Badge variant="secondary" className="text-[10px]">SW Florida</Badge>
      </div>

      {/* Selectors */}
      <div className="px-4 pt-4 pb-3 space-y-3">
        {/* County selector */}
        <div>
          <p className="section-header px-0 pt-0 pb-1">County / Jurisdiction</p>
          <Select value={selectedCounty} onValueChange={onCountyChange}>
            <SelectTrigger data-testid="select-county" className="w-full h-12 rounded-xl text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <SelectValue placeholder="Select county..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              {counties.map((c) => (
                <SelectItem key={c.id} value={c.id} className="py-3">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground ml-1.5 text-xs">— {c.region}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Project selector */}
        <div>
          <p className="section-header px-0 pt-0 pb-1">Project Type</p>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger data-testid="select-project-type" className="w-full h-12 rounded-xl text-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <SelectValue placeholder="Choose a project..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Building
              </div>
              {projectTypes
                .filter((p) => p.category === "building")
                .map((p) => (
                  <SelectItem key={p.id} value={p.id} className="py-2.5">{p.name}</SelectItem>
                ))}
              <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-t border-border mt-1 pt-1.5">
                Trade
              </div>
              {projectTypes
                .filter((p) => p.category === "trade")
                .map((p) => (
                  <SelectItem key={p.id} value={p.id} className="py-2.5">{p.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty state */}
      {!project ? (
        <div className="px-4 py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Choose a project type</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Select a county and project type above to see permit requirements, fees, and timeline
          </p>
        </div>
      ) : (
        <div className="px-4 space-y-3 pb-4">

          {/* County info bar */}
          {county && (
            <div className="flex items-center gap-2.5 bg-accent/50 rounded-xl px-3 py-2.5">
              <MapPin className="w-3.5 h-3.5 text-accent-foreground shrink-0" />
              <span className="text-xs font-medium text-foreground">{county.name}</span>
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-[11px] text-muted-foreground">{county.phone}</span>
              {county.portalUrl && (
                <a
                  href={county.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-primary hover:underline flex items-center gap-0.5 text-xs"
                >
                  Portal <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </div>
          )}

          {/* Description card */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-sm text-foreground leading-relaxed">{project.description}</p>
            {project.exemptionNote && (
              <div className="flex items-start gap-2 mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 rounded-xl p-2.5">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span className="font-medium">{project.exemptionNote}</span>
              </div>
            )}
          </div>

          {/* Required Permits card */}
          <ExpandableCard
            id="permits"
            title="Required Permits"
            icon={<CheckCircle2 className="w-4 h-4" />}
            expanded={expandedCards.has("permits")}
            onToggle={() => toggleCard("permits")}
            badge={String(project.permits.filter((p) => p.required).length)}
          >
            <div className="space-y-2">
              {project.permits.map((permit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border"
                  data-testid={`permit-item-${i}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {permit.required ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-medium text-foreground">{permit.name}</span>
                      <Badge
                        variant={permit.required ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {permit.required ? "Required" : "If Applicable"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{permit.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </ExpandableCard>

          {/* Estimated Fees card */}
          <ExpandableCard
            id="fees"
            title={`Fees${county ? ` — ${county.name.replace(" County", "")}` : ""}`}
            icon={<DollarSign className="w-4 h-4" />}
            expanded={expandedCards.has("fees")}
            onToggle={() => toggleCard("fees")}
          >
            {fees ? (
              <div className="space-y-3">
                {/* Fee range */}
                <div className="bg-primary/8 border border-primary/20 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Permit Fee Range</p>
                  <p className="text-xl font-bold text-foreground">
                    ${fees.min.toLocaleString()} – ${fees.max.toLocaleString()}
                  </p>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (fees.max / maxFeeAcrossCounties) * 100)}%` }}
                    />
                  </div>
                  {fees.note && (
                    <p className="text-[11px] text-muted-foreground italic mt-2">{fees.note}</p>
                  )}
                  <div className="space-y-1.5 text-xs mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>FL Admin Surcharge (1.5%, min $2)</span>
                      <span>+${Math.max(2, Math.round(fees.max * 0.015))}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>FL Radon Surcharge (1%, min $2)</span>
                      <span>+${Math.max(2, Math.round(fees.max * 0.01))}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-foreground border-t border-border pt-1.5 mt-1">
                      <span>Estimated Total</span>
                      <span>
                        ${Math.round(fees.min * 1.025).toLocaleString()} – ${Math.round(fees.max * 1.025).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compare across counties — horizontal bar chart */}
                <div className="bg-card rounded-xl border border-border p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    Compare across counties
                  </p>
                  <div className="space-y-2.5">
                    {counties
                      .filter((c) => project.feesByCounty[c.id])
                      .sort((a, b) => project.feesByCounty[a.id].max - project.feesByCounty[b.id].max)
                      .map((c) => {
                        const f = project.feesByCounty[c.id];
                        const isSelected = c.id === selectedCounty;
                        const pct = Math.min(100, (f.max / maxFeeAcrossCounties) * 100);
                        return (
                          <div key={c.id} className="flex items-center gap-2.5">
                            <span
                              className={`text-xs w-24 truncate shrink-0 ${
                                isSelected ? "font-semibold text-primary" : "text-muted-foreground"
                              }`}
                            >
                              {c.name.replace(" County", "")}
                            </span>
                            <div className="fee-bar-track">
                              <div
                                className={`fee-bar-fill ${isSelected ? "selected" : "unselected"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span
                              className={`text-[11px] w-20 text-right shrink-0 ${
                                isSelected ? "font-semibold text-primary" : "text-muted-foreground"
                              }`}
                            >
                              ${f.min}–${f.max}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {county?.feeScheduleUrl && (
                  <a
                    href={county.feeScheduleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {county.name} Official Fee Schedule
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a county to see localized fee estimates.</p>
            )}
          </ExpandableCard>

          {/* Timeline & Inspections card */}
          <ExpandableCard
            id="inspections"
            title="Timeline & Inspections"
            icon={<Clock className="w-4 h-4" />}
            expanded={expandedCards.has("inspections")}
            onToggle={() => toggleCard("inspections")}
            badge={String(project.inspectionsRequired.length)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-muted/40 rounded-xl px-3 py-2.5">
                <span className="text-xs text-muted-foreground">Estimated Review Time</span>
                <Badge variant="secondary" className="text-xs">{project.estimatedTimeline}</Badge>
              </div>
              <div className="space-y-2">
                {project.inspectionsRequired.map((inspection, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-foreground py-1"
                    data-testid={`inspection-${i}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    {inspection}
                  </div>
                ))}
              </div>
            </div>
          </ExpandableCard>

          {/* Pro Tips card */}
          <ExpandableCard
            id="tips"
            title="Pro Tips"
            icon={<Lightbulb className="w-4 h-4" />}
            expanded={expandedCards.has("tips")}
            onToggle={() => toggleCard("tips")}
          >
            <div className="space-y-2.5">
              {project.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Lightbulb className="w-3.5 h-3.5 mt-0.5 text-yellow-500 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
              {county && (
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border italic">
                  {county.notes}
                </p>
              )}
            </div>
          </ExpandableCard>
        </div>
      )}
    </div>
  );
}

// ─── Expandable Card ─────────────────────────────────────────────────────────

function ExpandableCard({
  id,
  title,
  icon,
  expanded,
  onToggle,
  badge,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden" data-testid={`card-${id}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors text-left touch-target"
        style={{ minHeight: 56 }}
      >
        <span className="text-primary shrink-0">{icon}</span>
        <span className="text-sm font-semibold text-foreground flex-1">{title}</span>
        {badge !== undefined && (
          <Badge variant="secondary" className="text-xs px-2 py-0.5 shrink-0">{badge}</Badge>
        )}
        {expanded
          ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        }
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}
