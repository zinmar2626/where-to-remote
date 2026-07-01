import { useEffect, useMemo } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet"
import L from "leaflet"
import type { City } from "../data/types"
import { useTheme } from "../context/ThemeContext"

// Fix Leaflet default icon paths (broken with bundlers)
import "leaflet/dist/leaflet.css"

// Custom marker icon
function createIcon(emoji: string) {
  return L.divIcon({
    html: `<div class="map-marker">${emoji}</div>`,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  })
}

function getWorkspaceEmoji(city: City): string {
  const tagEmoji: Record<string, string> = {
    coworking: "💻",
    cafe: "☕",
    quiet: "🤫",
    social: "🗣️",
    nature: "🌿",
    garden: "🌱",
    wellness: "🧘",
    budget: "💰",
    professional: "👔",
    expat: "🌏",
    lake: "🌊",
    scenic: "🏞️",
    study: "📚",
    sanchaung: "☕",
    yawmingyi: "💼",
    inya: "🌅",
  }
  for (const tag of city.tags) {
    if (tagEmoji[tag]) return tagEmoji[tag]
  }
  return "📍"
}

// Auto-fit map bounds to visible workspaces
function FitBounds({ cities }: { cities: City[] }) {
  const map = useMap()

  const bounds = useMemo(() => {
    if (cities.length === 0) return null
    if (cities.length === 1) {
      const c = cities[0]
      return L.latLngBounds(
        [c.lat - 0.02, c.lng - 0.02],
        [c.lat + 0.02, c.lng + 0.02],
      )
    }
    return L.latLngBounds(cities.map((c) => [c.lat, c.lng] as [number, number]))
  }, [cities])

  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15, duration: 0.8 })
    }
  }, [bounds, map])

  return null
}

// Tile layer that reacts to theme changes
function ThemedTileLayer() {
  const { theme } = useTheme()
  return (
    <TileLayer
      key={theme.id}
      url={theme.mapTileUrl}
      attribution={theme.mapAttribution}
    />
  )
}

interface MapViewProps {
  cities: City[]
}

export default function MapView({ cities }: MapViewProps) {
  return (
    <div className="h-screen flex-1">
      <MapContainer
        center={[16.8409, 96.1735]}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <ThemedTileLayer />
        <FitBounds cities={cities} />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.lat, city.lng]}
            icon={createIcon(getWorkspaceEmoji(city))}
          >
            <Popup>
              <div className="min-w-[200px] font-sans" style={{ color: "var(--text-primary)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getWorkspaceEmoji(city)}</span>
                  <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                    {city.name}
                  </h3>
                </div>
                <p className="text-[11px] mb-1" style={{ color: "var(--text-muted)" }}>
                  {city.address}
                </p>
                <span
                  className="inline-block mb-2 text-[11px] font-medium rounded-full px-2 py-0.5"
                  style={{
                    color: "var(--accent-text)",
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent-border)",
                  }}
                >
                  {city.mainVibe}
                </span>
                <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
                  {city.description}
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span
                    className="rounded-full px-2 py-0.5 font-medium"
                    style={{
                      background: "var(--accent-bg)",
                      color: "var(--accent-text)",
                      border: "1px solid var(--accent-border)",
                    }}
                  >
                    📶 {city.internetMbps} Mbps
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 font-medium"
                    style={{
                      background: "var(--bg-card)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    🔇 {["", "Library", "Calm", "Moderate", "Buzzy", "Lively"][city.noiseLevel]}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 font-medium"
                    style={{
                      background: "var(--bg-card)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    💸 {(city.priceMMK / 1000).toFixed(0)}K MMK
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 font-medium"
                    style={{
                      background: city.hasGenerator ? "var(--accent-bg)" : "rgba(239,68,68,0.1)",
                      color: city.hasGenerator ? "var(--accent-text)" : "rgb(252,165,165)",
                      border: `1px solid ${city.hasGenerator ? "var(--accent-border)" : "rgba(239,68,68,0.2)"}`,
                    }}
                  >
                    🔌 {city.hasGenerator ? "Generator" : "No backup"}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
