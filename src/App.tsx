import { useMemo, useState, useCallback } from "react"
import { cities } from "./data/cities"
import { filterCities, type FilterState } from "./utils/matching"
import Sidebar from "./components/Sidebar"
import MapView from "./components/MapView"

const DEFAULT_FILTERS: FilterState = {
  minWifiStability: 0,
  maxNoiseLevel: 5,
  maxPriceMMK: 30000,
  requireGenerator: false,
  selectedVibeIds: [],
}

export default function App() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleToggleVibe = useCallback((vibeId: string) => {
    setFilters((prev) => {
      const exists = prev.selectedVibeIds.includes(vibeId)
      return {
        ...prev,
        selectedVibeIds: exists
          ? prev.selectedVibeIds.filter((id) => id !== vibeId)
          : [...prev.selectedVibeIds, vibeId],
      }
    })
  }, [])

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const matchedCities = useMemo(
    () => filterCities(cities, filters),
    [filters],
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar
        filters={filters}
        matchCount={matchedCities.length}
        totalCount={cities.length}
        onFilterChange={handleFilterChange}
        onToggleVibe={handleToggleVibe}
        onReset={handleReset}
      />
      <MapView cities={matchedCities} />
    </div>
  )
}
