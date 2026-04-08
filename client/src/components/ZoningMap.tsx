import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Layers, MapPin, LocateFixed, X, Phone, ExternalLink, ChevronRight } from "lucide-react";
import { zoningCategories, counties, type County } from "@/lib/permit-data";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// SW FL region center — roughly between Tampa and Naples
const SWFL_CENTER: L.LatLngExpression = [27.3, -82.2];
const SWFL_ZOOM = 8;

function getZoneColor(zoneCode: string): string {
  if (!zoneCode) return "#94a3b8";
  const prefix = zoneCode.replace(/[^A-Z]/g, "").substring(0, 2);
  return zoningCategories[prefix]?.color || "#94a3b8";
}

function getZoneLabel(zoneCode: string): string {
  if (!zoneCode) return "Unknown";
  const prefix = zoneCode.replace(/[^A-Z]/g, "").substring(0, 2);
  return zoningCategories[prefix]?.label || zoneCode;
}

async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const q = encodeURIComponent(address + ", Florida");
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`);
    const data = await res.json();
    if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch (e) { console.error("Geocode error:", e); }
  return null;
}

function generateSWFLZoningData(): GeoJSON.FeatureCollection {
  const zones: Array<{ zone: string; lat: number; lng: number; w: number; h: number }> = [];
  for (const county of counties) {
    const [lat, lng] = county.center;
    const zoneTypes = ["RS-50", "RS-60", "RM-16", "CG", "CN", "PD", "IG", "OS", "CD-1", "AG"];
    for (let i = 0; i < 8; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.15;
      const offsetLng = (Math.random() - 0.5) * 0.15;
      const w = 0.01 + Math.random() * 0.02;
      const h = 0.008 + Math.random() * 0.016;
      zones.push({ zone: zoneTypes[i % zoneTypes.length], lat: lat + offsetLat, lng: lng + offsetLng, w, h });
    }
  }
  return {
    type: "FeatureCollection",
    features: zones.map((z) => ({
      type: "Feature" as const,
      properties: { ZONING: z.zone, Shape__Area: z.w * z.h * 1e9 },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [z.lng - z.w, z.lat - z.h],
          [z.lng + z.w, z.lat - z.h],
          [z.lng + z.w, z.lat + z.h],
          [z.lng - z.w, z.lat + z.h],
          [z.lng - z.w, z.lat - z.h],
        ]],
      },
    })),
  };
}

interface Props {
  selectedCounty: string;
  onCountyChange: (county: string) => void;
  onViewPermits: (countyId: string) => void;
}

// County bottom sheet
function CountySheet({
  county,
  onClose,
  onViewPermits,
}: {
  county: County;
  onClose: () => void;
  onViewPermits: (id: string) => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="bottom-sheet-backdrop"
        onClick={onClose}
        data-testid="sheet-backdrop"
      />
      {/* Sheet */}
      <div className="bottom-sheet" data-testid="county-sheet">
        <div className="bottom-sheet-handle" />

        <div className="px-4 pb-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "hsl(var(--primary) / 0.12)" }}
              >
                <MapPin className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{county.name}</h3>
                <p className="text-xs text-muted-foreground">{county.region}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="touch-target rounded-full hover:bg-muted/60"
              data-testid="button-close-sheet"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Notes */}
          {county.notes && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 bg-muted/40 rounded-xl p-3">
              {county.notes}
            </p>
          )}

          {/* Contact row */}
          <div className="flex items-center gap-3 mb-4">
            <a
              href={`tel:${county.phone.replace(/[^0-9+]/g, "")}`}
              className="flex-1 flex items-center gap-2 p-3 rounded-xl border border-border bg-card card-pressable"
              data-testid="link-county-phone"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">{county.phone}</span>
            </a>
            {county.portalUrl && (
              <a
                href={county.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center gap-2 p-3 rounded-xl border border-border bg-card card-pressable"
                data-testid="link-county-portal"
              >
                <ExternalLink className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Permit Portal</span>
              </a>
            )}
          </div>

          {/* View Permits CTA */}
          <Button
            className="w-full rounded-xl h-12 text-sm font-semibold"
            onClick={() => onViewPermits(county.id)}
            data-testid="button-view-permits"
          >
            View Permits &amp; Fees
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </>
  );
}

// Zone info badge (floating)
function ZoneInfoBadge({
  zone,
  onClose,
}: {
  zone: { zone: string; area?: number };
  onClose: () => void;
}) {
  return (
    <div
      className="absolute bottom-20 left-3 z-[1000] bg-card border border-border rounded-2xl p-3 shadow-lg max-w-[220px] result-badge"
      data-testid="zone-info-badge"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <Badge variant="secondary" className="mb-1.5 text-xs font-mono">{zone.zone}</Badge>
          <p className="text-sm font-medium text-foreground">{getZoneLabel(zone.zone)}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-close-zone"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ZoningMap({ selectedCounty, onCountyChange, onViewPermits }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const countyMarkersRef = useRef<L.LayerGroup | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<{ zone: string; area?: number } | null>(null);
  const [searchAddress, setSearchAddress] = useState("");
  const [searching, setSearching] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [sheetCounty, setSheetCounty] = useState<County | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SWFL_CENTER,
      zoom: SWFL_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
      tap: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://osm.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add county markers
    const countyMarkers = L.layerGroup().addTo(map);
    counties.forEach((c) => {
      const marker = L.circleMarker(c.center as L.LatLngExpression, {
        radius: 10,
        fillColor: "#0e7490",
        color: "#ffffff",
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(countyMarkers);
      marker.bindTooltip(
        `<strong>${c.name}</strong><br/><span style="font-size:11px;color:#666">${c.region}</span>`,
        { className: "zone-tooltip" }
      );
      marker.on("click", () => {
        onCountyChange(c.id);
        map.setView(c.center as L.LatLngExpression, 11, { animate: true });
        setSheetCounty(c);
        setShowLegend(false);
      });
    });
    countyMarkersRef.current = countyMarkers;

    mapRef.current = map;
    loadZoningData(map);

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Fly to county when selected externally
  useEffect(() => {
    if (!mapRef.current || !selectedCounty) return;
    const county = counties.find((c) => c.id === selectedCounty);
    if (county) {
      mapRef.current.setView(county.center as L.LatLngExpression, 11, { animate: true });
    }
  }, [selectedCounty]);

  const loadZoningData = async (map: L.Map) => {
    setLoading(true);
    const data = generateSWFLZoningData();

    const geoLayer = L.geoJSON(data, {
      style: (feature) => ({
        fillColor: getZoneColor(feature?.properties?.ZONING || ""),
        weight: 1,
        opacity: 0.7,
        color: "#475569",
        fillOpacity: 0.35,
      }),
      onEachFeature: (feature, layer) => {
        const zone = feature.properties?.ZONING || "Unknown";
        layer.bindTooltip(zone, { className: "zone-tooltip", sticky: true });
        layer.on("click", () => setSelectedZone({ zone, area: feature.properties?.Shape__Area }));
      },
    }).addTo(map);

    geoLayerRef.current = geoLayer;
    setLoading(false);
  };

  const handleSearch = useCallback(async () => {
    if (!searchAddress.trim() || !mapRef.current) return;
    setSearching(true);
    const result = await geocodeAddress(searchAddress);
    if (result && mapRef.current) {
      if (markerRef.current) markerRef.current.remove();
      const marker = L.marker(result)
        .addTo(mapRef.current)
        .bindPopup(`<strong style="font-size:13px">${searchAddress}</strong><br/><span style="color:#666;font-size:11px">${result[0].toFixed(5)}, ${result[1].toFixed(5)}</span>`)
        .openPopup();
      markerRef.current = marker;
      mapRef.current.setView(result, 14, { animate: true });
    }
    setSearching(false);
  }, [searchAddress]);

  const handleReset = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(SWFL_CENTER, SWFL_ZOOM, { animate: true });
      if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
      setSelectedZone(null);
      setSheetCounty(null);
    }
  }, []);

  return (
    <div className="map-screen" data-testid="zoning-map">
      {/* Floating search bar */}
      <div className="map-search-overlay">
        <MapPin className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--muted-foreground))" }} />
        <input
          type="search"
          data-testid="input-address-search"
          placeholder="Search address in SW Florida..."
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
        />
        {searching ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-primary" />
        ) : (
          <button
            onClick={handleSearch}
            className="text-xs font-semibold text-primary px-2 py-1 rounded-lg touch-target"
            data-testid="button-search"
          >
            Go
          </button>
        )}
        <button
          onClick={handleReset}
          className="touch-target rounded-full"
          data-testid="button-reset"
          title="Reset view"
        >
          <LocateFixed className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
        </button>
      </div>

      {/* Legend toggle */}
      <div className="map-legend-btn">
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="w-11 h-11 rounded-xl bg-card/92 border border-border shadow-md flex items-center justify-center backdrop-blur card-pressable"
          data-testid="button-toggle-legend"
          style={{ backdropFilter: "blur(12px)" }}
        >
          <Layers className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Legend panel */}
      {showLegend && (
        <div className="map-legend-panel" data-testid="legend-panel">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-foreground">Zoning Legend</h4>
            <button onClick={() => setShowLegend(false)} className="text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5">
            {Object.entries(zoningCategories).map(([code, info]) => (
              <div key={code} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm shrink-0 border border-border"
                  style={{ backgroundColor: info.color }}
                />
                <span className="text-xs text-foreground">
                  <span className="font-medium">{code}</span> — {info.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2.5 pt-2 border-t border-border">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block border-2 border-white shrink-0"
                style={{ background: "#0e7490" }}
              />
              County seat — tap to view info
            </p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card rounded-2xl px-4 py-3 shadow-md border border-border">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Loading zoning data...
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainerRef} className="absolute inset-0" />

      {/* Zone info badge */}
      {selectedZone && (
        <ZoneInfoBadge zone={selectedZone} onClose={() => setSelectedZone(null)} />
      )}

      {/* County bottom sheet */}
      {sheetCounty && (
        <CountySheet
          county={sheetCounty}
          onClose={() => setSheetCounty(null)}
          onViewPermits={(id) => {
            setSheetCounty(null);
            onViewPermits(id);
          }}
        />
      )}
    </div>
  );
}
