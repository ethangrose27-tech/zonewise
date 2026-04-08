import { useState } from "react";
import LicenseVerifier from "@/components/LicenseVerifier";
import {
  tradeCategories,
  counties,
  getGoogleMapsSearchUrl,
  getYelpSearchUrl,
  getAngiSearchUrl,
  type TradeCategory,
} from "@/lib/permit-data";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Compass,
  PenTool,
  Hammer,
  Zap,
  Droplets,
  Thermometer,
  Waves,
  Sun,
  Rocket,
  Home,
  ExternalLink,
  MapPin,
  Star,
  ShieldCheck,
  ChevronLeft,
  Users,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Compass, PenTool, Hammer, Zap, Droplets, Thermometer, Waves, Sun, Rocket, Home,
};

interface Props {
  selectedCounty: string;
  onCountyChange: (county: string) => void;
}

export default function ConsultantReferrals({ selectedCounty, onCountyChange }: Props) {
  const [selectedTrade, setSelectedTrade] = useState<string>("");
  const county = counties.find((c) => c.id === selectedCounty);
  const trade = tradeCategories.find((t) => t.id === selectedTrade);

  return (
    <div data-testid="consultant-referrals" className="scroll-with-tab-bar">
      {/* Sticky header */}
      <div className="mobile-header sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {trade ? (
            <button
              onClick={() => setSelectedTrade("")}
              className="touch-target rounded-full mr-1 -ml-1 flex items-center justify-center"
              data-testid="button-back-to-trades"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          ) : (
            <Users className="w-5 h-5 text-primary shrink-0" />
          )}
          <h1 className="text-base font-semibold text-foreground">
            {trade ? trade.name : "Find Professionals"}
          </h1>
        </div>
        <Badge variant="secondary" className="text-[10px]">FL Licensed</Badge>
      </div>

      {/* County selector — always visible */}
      <div className="px-4 pt-4 pb-2">
        <p className="section-header px-0 pt-0 pb-1">Your Area</p>
        <Select value={selectedCounty} onValueChange={onCountyChange}>
          <SelectTrigger className="w-full h-12 rounded-xl text-sm" data-testid="select-referral-county">
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

      {trade ? (
        /* ─── Trade Detail View ─── */
        <TradeDetailView
          trade={trade}
          county={county}
          selectedCounty={selectedCounty}
        />
      ) : (
        /* ─── Trade Grid ─── */
        <TradeGrid
          onSelect={setSelectedTrade}
          selectedCounty={selectedCounty}
        />
      )}
    </div>
  );
}

// ─── Trade Grid ───────────────────────────────────────────────────────────────

function TradeGrid({
  onSelect,
  selectedCounty,
}: {
  onSelect: (id: string) => void;
  selectedCounty: string;
}) {
  return (
    <div className="px-4 pb-4">
      <p className="section-header px-0 pb-3">
        {selectedCounty ? "Select a Trade" : "Select your county, then a trade"}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {tradeCategories.map((t) => {
          const Icon = iconMap[t.icon] || Hammer;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className="trade-card card-pressable"
              data-testid={`trade-card-${t.id}`}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "hsl(var(--primary) / 0.1)" }}
              >
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground leading-tight text-center">
                {t.name}
              </span>
              {t.dbprLicenseType && (
                <span className="text-[10px] text-muted-foreground font-mono">
                  {t.dbprLicenseType}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Trade Detail View ────────────────────────────────────────────────────────

function TradeDetailView({
  trade,
  county,
  selectedCounty,
}: {
  trade: TradeCategory;
  county: ReturnType<typeof counties.find>;
  selectedCounty: string;
}) {
  const Icon = iconMap[trade.icon] || Hammer;

  return (
    <div className="px-4 pb-4 space-y-4">
      {/* Trade info header */}
      <div
        className="rounded-2xl p-4 flex items-start gap-4"
        style={{ background: "hsl(var(--accent) / 0.5)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--primary) / 0.12)" }}
        >
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-foreground">{trade.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{trade.description}</p>
          {trade.dbprLicenseType && (
            <Badge variant="secondary" className="text-xs mt-2 font-mono">
              FL License: {trade.dbprLicenseType}
            </Badge>
          )}
        </div>
      </div>

      {/* Search action cards */}
      <div>
        <p className="section-header px-0 pt-0 pb-2">
          Find {trade.name.toLowerCase()} near {county?.region || "you"}
        </p>
        <div className="space-y-2.5">
          {/* Google Maps */}
          <a
            href={getGoogleMapsSearchUrl(trade.searchTerms, selectedCounty)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card card-pressable"
            data-testid="link-google-maps"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Google Maps</p>
              <p className="text-xs text-muted-foreground mt-0.5">Nearby pros with reviews and directions</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
          </a>

          {/* Yelp */}
          <a
            href={getYelpSearchUrl(trade.searchTerms, selectedCounty)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card card-pressable"
            data-testid="link-yelp"
          >
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Yelp</p>
              <p className="text-xs text-muted-foreground mt-0.5">Detailed reviews and ratings</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
          </a>

          {/* Angi */}
          <a
            href={getAngiSearchUrl(trade.searchTerms, selectedCounty)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card card-pressable"
            data-testid="link-angi"
          >
            <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-950 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Angi</p>
              <p className="text-xs text-muted-foreground mt-0.5">Quotes and vetted home service pros</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
          </a>
        </div>
      </div>

      {/* License Verifier section */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <LicenseVerifier />
      </div>

      {/* Hiring tips */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <p className="text-sm font-semibold text-foreground">Hiring Tips</p>
        </div>
        <div className="space-y-2">
          {[
            "Get at least 3 written quotes before committing",
            "Verify active FL license and insurance (liability + workers' comp)",
            "Ask for references from similar projects in your county",
            "Ensure the contractor pulls all required permits — not you",
            "Never pay more than 10% deposit upfront for large projects",
            "Florida law: contractors must carry workers' compensation insurance",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
