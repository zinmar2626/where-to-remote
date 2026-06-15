export interface City {
  id: string
  name: string
  country: string
  image: string
  tags: string[]
  costOfLiving: 1 | 2 | 3 | 4 | 5
  internetMbps: number
  coffeeQuality: 1 | 2 | 3 | 4 | 5
  nightlife: 1 | 2 | 3 | 4 | 5
  timezone: string
  description: string
  lat: number
  lng: number
  hasGenerator: boolean
  address: string
  mainVibe: string
  noiseLevel: 1 | 2 | 3 | 4 | 5    // 1=library quiet, 5=bustling/lively
  priceMMK: number                   // approximate daily cost in MMK (thousands)
}
