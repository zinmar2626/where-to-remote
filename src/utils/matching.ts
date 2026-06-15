import type { City } from "../data/types"

export interface VibeTag {
  id: string
  label: string
  emoji: string
}

export interface VibePreset {
  id: string
  label: string
  emoji: string
  description: string
  tags: string[]
}

export const VIBE_OPTIONS: VibeTag[] = [
  { id: "expat", label: "Expat Friendly", emoji: "🌏" },
  { id: "coworking", label: "Coworking Desk", emoji: "💻" },
  { id: "cafe", label: "Café Culture", emoji: "☕" },
  { id: "quiet", label: "Quiet & Focused", emoji: "🤫" },
  { id: "social", label: "Social & Lively", emoji: "🗣️" },
  { id: "lake", label: "Lake Views", emoji: "🌊" },
  { id: "nature", label: "Nature & Garden", emoji: "🌿" },
  { id: "budget", label: "Budget Friendly", emoji: "💸" },
  { id: "professional", label: "Professional", emoji: "👔" },
]

export const VIBE_PRESETS: VibePreset[] = [
  {
    id: "yaw-min-gyi-expats",
    label: "Yaw Min Gyi Expats",
    emoji: "🌏",
    description: "Professional coworking, expat crowd, downtown Dagon",
    tags: ["expat", "yawmingyi", "professional", "coworking"],
  },
  {
    id: "inya-lake-view",
    label: "Inya Lake View",
    emoji: "🌊",
    description: "Scenic spots near the lake, great coffee, relaxed vibe",
    tags: ["lake", "scenic", "inya", "cafe"],
  },
  {
    id: "sanchaung-cafe-hopping",
    label: "Sanchaung Cafe Hopping",
    emoji: "☕",
    description: "Bounce between cafés, social atmosphere, study-friendly",
    tags: ["cafe", "social", "sanchaung", "study"],
  },
]

export interface FilterState {
  minWifiStability: number   // 0–300 Mbps slider
  maxNoiseLevel: number       // 1–5 (show only spots ≤ this)
  maxPriceMMK: number         // 5000–30000 MMK slider
  requireGenerator: boolean
  selectedVibeIds: string[]
}

export function filterCities(cities: City[], filters: FilterState): City[] {
  return cities.filter((city) => {
    // Wi-Fi stability threshold (minimum Mbps)
    if (city.internetMbps < filters.minWifiStability) return false

    // Noise ceiling (only show spots this quiet or quieter)
    if (city.noiseLevel > filters.maxNoiseLevel) return false

    // Price ceiling in MMK
    if (city.priceMMK > filters.maxPriceMMK) return false

    // Generator requirement
    if (filters.requireGenerator && !city.hasGenerator) return false

    // Vibe presets
    if (filters.selectedVibeIds.length > 0) {
      const requiredTags = new Set<string>()
      for (const vibeId of filters.selectedVibeIds) {
        const preset = VIBE_PRESETS.find((p) => p.id === vibeId)
        if (preset) {
          for (const tag of preset.tags) {
            requiredTags.add(tag)
          }
        }
      }
      const hasMatch = city.tags.some((tag) => requiredTags.has(tag))
      if (!hasMatch) return false
    }

    return true
  })
}

export function filterCitiesByVibes(
  cities: City[],
  selectedVibes: string[],
): City[] {
  if (selectedVibes.length === 0) return cities
  return cities.filter((city) =>
    selectedVibes.some((vibe) => city.tags.includes(vibe)),
  )
}
