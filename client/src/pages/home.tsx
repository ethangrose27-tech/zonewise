import { useState } from "react";
import ZoningMap from "@/components/ZoningMap";
import PermitCalculator from "@/components/PermitCalculator";
import ConsultantReferrals from "@/components/ConsultantReferrals";
import DataSourcesPanel from "@/components/DataSourcesPanel";
import { Map, FileText, Users, Database } from "lucide-react";

export type AppTab = "map" | "permits" | "pros" | "data";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<AppTab>("map");
  const [selectedCounty, setSelectedCounty] = useState("hillsborough");

  const tabs: { id: AppTab; label: string; icon: React.ElementType }[] = [
    { id: "map",     label: "Map",     icon: Map      },
    { id: "permits", label: "Permits", icon: FileText  },
    { id: "pros",    label: "Find Pros", icon: Users   },
    { id: "data",    label: "Data",    icon: Database  },
  ];

  // When user taps "View Permits" from map bottom sheet
  const handleViewPermits = (countyId: string) => {
    setSelectedCounty(countyId);
    setActiveTab("permits");
  };

  return (
    <div className="app-shell" data-testid="home-page">
      {/* Main content area */}
      <div className="tab-content">
        {/* Map tab — always mounted so the Leaflet map stays alive */}
        <div
          className="map-screen"
          style={{
            display: activeTab === "map" ? "block" : "none",
            height: "100%",
          }}
        >
          <ZoningMap
            selectedCounty={selectedCounty}
            onCountyChange={setSelectedCounty}
            onViewPermits={handleViewPermits}
          />
        </div>

        {/* Permits tab */}
        {activeTab === "permits" && (
          <div className="page-enter page-enter-active h-full overflow-y-auto ios-scroll">
            <PermitCalculator
              selectedCounty={selectedCounty}
              onCountyChange={setSelectedCounty}
            />
          </div>
        )}

        {/* Find Pros tab */}
        {activeTab === "pros" && (
          <div className="page-enter page-enter-active h-full overflow-y-auto ios-scroll">
            <ConsultantReferrals
              selectedCounty={selectedCounty}
              onCountyChange={setSelectedCounty}
            />
          </div>
        )}

        {/* Data tab */}
        {activeTab === "data" && (
          <div className="page-enter page-enter-active h-full overflow-y-auto ios-scroll">
            <DataSourcesPanel />
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="tab-bar" role="tablist" aria-label="Main navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-bar-item${isActive ? " active" : ""}`}
              data-testid={`tab-${tab.id}`}
            >
              <Icon
                className="tab-icon"
                style={{ width: 22, height: 22 }}
                color={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
