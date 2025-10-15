<template>
  <div class="space-y-4">
    <!-- Search Input -->
    <div>
      <UInput
        v-model="searchQuery"
        placeholder="Cari lokasi..."
        icon="i-heroicons-magnifying-glass-20-solid"
        @update:model-value="handleSearch"
      />
      <div v-if="searchResults.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div
          v-for="result in searchResults"
          :key="result.place_id"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100"
          @click="selectSearchResult(result)"
        >
          <div class="text-sm font-medium">{{ result.name }}</div>
          <div class="text-xs text-gray-500">{{ result.display_name }}</div>
        </div>
      </div>
    </div>

    <!-- Coordinates Display -->
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Latitude" name="latitude">
        <UInput
          v-model="modelValue.latitude"
          type="number"
          step="0.000001"
          placeholder="0.0000"
          @update:model-value="updateMap"
        />
      </UFormGroup>
      <UFormGroup label="Longitude" name="longitude">
        <UInput
          v-model="modelValue.longitude"
          type="number"
          step="0.000001"
          placeholder="0.0000"
          @update:model-value="updateMap"
        />
      </UFormGroup>
    </div>

    <!-- Map Container -->
    <div class="border border-gray-300 rounded-lg overflow-hidden bg-gray-50" style="height: 400px">
      <div ref="mapContainer" class="w-full h-full"></div>
    </div>

    <!-- Location Display -->
    <div v-if="selectedLocation" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="text-sm">
        <div class="font-semibold text-gray-900">{{ selectedLocation.name || 'Selected Location' }}</div>
        <div class="text-xs text-gray-600 mt-1">
          Lat: {{ modelValue.latitude }}, Lon: {{ modelValue.longitude }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LocationCoordinates {
  latitude: number | null
  longitude: number | null
}

interface SearchResult {
  place_id: number
  name: string
  display_name: string
  lat: string
  lon: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: LocationCoordinates
  }>(),
  {
    modelValue: () => ({
      latitude: null,
      longitude: null
    })
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: LocationCoordinates]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const marker = ref<L.Marker | null>(null)
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const selectedLocation = ref<SearchResult | null>(null)
const searchTimeout = ref<NodeJS.Timeout | null>(null)

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Default location (Indonesia center)
const defaultLat = -2.548926
const defaultLon = 118.0148634

onMounted(async () => {
  await nextTick()

  if (!mapContainer.value) return

  // Initialize map
  map.value = L.map(mapContainer.value).setView(
    [modelValue.value?.latitude || defaultLat, modelValue.value?.longitude || defaultLon],
    13
  )

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map.value)

  // Add initial marker if coordinates exist
  if (modelValue.value?.latitude && modelValue.value?.longitude) {
    addMarker(modelValue.value.latitude, modelValue.value.longitude)
  }

  // Map click handler
  map.value.on('click', (e) => {
    const { lat, lng } = e.latlng
    modelValue.value = {
      latitude: Math.round(lat * 1000000) / 1000000,
      longitude: Math.round(lng * 1000000) / 1000000
    }
    addMarker(lat, lng)
    reverseGeocode(lat, lng)
  })
})

const addMarker = (lat: number, lng: number) => {
  if (marker.value) {
    map.value?.removeLayer(marker.value)
  }

  marker.value = L.marker([lat, lng])
    .addTo(map.value!)
    .bindPopup(`<div class="text-sm"><strong>Location</strong><br/>Lat: ${lat.toFixed(6)}<br/>Lon: ${lng.toFixed(6)}</div>`)
    .openPopup()
}

const updateMap = () => {
  if (modelValue.value?.latitude && modelValue.value?.longitude && map.value) {
    const { latitude, longitude } = modelValue.value
    map.value.setView([latitude, longitude], 13)
    addMarker(latitude, longitude)
  }
}

const handleSearch = async (query: string) => {
  searchQuery.value = query

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  if (query.trim().length < 3) {
    searchResults.value = []
    return
  }

  searchTimeout.value = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      )
      const results = await response.json()
      searchResults.value = results
    }
    catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    }
  }, 300)
}

const selectSearchResult = (result: SearchResult) => {
  const lat = parseFloat(result.lat)
  const lng = parseFloat(result.lon)

  modelValue.value = {
    latitude: Math.round(lat * 1000000) / 1000000,
    longitude: Math.round(lng * 1000000) / 1000000
  }

  selectedLocation.value = result
  addMarker(lat, lng)
  map.value?.setView([lat, lng], 13)
  searchResults.value = []
  searchQuery.value = result.name
}

const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    )
    const result = await response.json()
    selectedLocation.value = {
      place_id: result.place_id,
      name: result.name || 'Unknown Location',
      display_name: result.display_name,
      lat: String(lat),
      lon: String(lng)
    }
  }
  catch (error) {
    console.error('Reverse geocode error:', error)
  }
}

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove()
  }
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>