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
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <FitBounds cities={cities} />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.lat, city.lng]}
            icon={createIcon(getWorkspaceEmoji(city))}
          >
            <Popup>
              <div className="min-w-[200px] font-sans">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getWorkspaceEmoji(city)}</span>
                  <h3 className="font-bold text-sm text-gray-900">
                    {city.name}
                  </h3>
                </div>
                <p className="text-[11px] text-gray-500 mb-1">
                  {city.address}
                </p>
                <span className="inline-block mb-2 text-[11px] font-medium text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                  {city.mainVibe}
                </span>
                <p className="text-xs text-gray-600 mb-2">
                  {city.description}
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-700 font-medium">
                    📶 {city.internetMbps} Mbps
                  </span>
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-700 font-medium">
                    🔇 {["", "Library", "Calm", "Moderate", "Buzzy", "Lively"][city.noiseLevel]}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">
                    💸 {(city.priceMMK / 1000).toFixed(0)}K MMK
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      city.hasGenerator
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-500"
                    }`}
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
