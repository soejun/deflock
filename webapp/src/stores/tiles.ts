import type { ALPR } from '@/types';
import axios from 'axios';
import type { BoundingBox } from '@/services/apiService'; // TODO: this is a strange place to hold this type

const api = axios.create({
  baseURL: 'https://cdn.deflock.me/regions',
});

export const useTilesStore = defineStore('tiles', () => {
  // Key: "lat/lng", Value: ALPR[]
  const tiles: Ref<Record<string, ALPR[]>> = ref({});
  const availableTiles: Ref<string[]> = ref([]);
  const expirationDateUtc: Ref<Date | null> = ref(null);
  const fetchingTiles = new Set<string>();
  let tileUrlTemplate: string|undefined = undefined;
  let tileSizeDegrees: number|undefined = undefined;

  const fetchIndex = async (): Promise<void> => {
    if (expirationDateUtc.value && expirationDateUtc.value > new Date()) {
      console.debug('Index is not expired, using cached index');
    } else {
      console.debug('Index is expired or not set, fetching new index');
      const response = await api.get('/index.json');
      expirationDateUtc.value = new Date(response.data.expiration_utc);
      availableTiles.value = response.data.regions;
      tileUrlTemplate = response.data.tile_url;
      tileSizeDegrees = response.data.tile_size_degrees;
    }
  }

  const fetchAndAddTile = async (lat: number, lng: number): Promise<void> => {
    const key = `${lat}/${lng}`;

    if (fetchingTiles.has(key)) {
      console.debug(`Tile ${key} is already being fetched, skipping fetch`);
      return;
    }

    if (tiles.value[key]) {
      console.debug(`Tile ${key} is already cached, skipping fetch`);
      return;
    }

    if (!tileUrlTemplate) {
      console.warn('Tile URL template is not set, skipping fetch');
      return;
    }
    const url = tileUrlTemplate.replace('{lat}/{lon}', key);
    
    try {
      fetchingTiles.add(key);
      const tile = await api.get(url);
      tiles.value[key] = tile.data;
    } catch (error) {
      console.error(`Failed to fetch tile ${key}:`, error);
    } finally {
      fetchingTiles.delete(key);
    }
  }

  const fetchVisibleTiles = async (boundingBox: BoundingBox): Promise<void> => {
    if (!tileUrlTemplate || !tileSizeDegrees) {
      console.debug('Tile URL template or tile size is not set, fetching...');
      await fetchIndex();
    }
  
    if (!tileUrlTemplate || !tileSizeDegrees) {
      console.warn('Tile URL template or tile size is still not set after fetching index');
      return;
    }

    const { minLat: south, minLng: west, maxLat: north, maxLng: east } = boundingBox;

    // Determine tiles in viewport
    const visibleTiles = [];
    for (let lat = Math.floor(south / tileSizeDegrees) * tileSizeDegrees; lat <= Math.ceil(north / tileSizeDegrees) * tileSizeDegrees; lat += tileSizeDegrees) {
      for (let lng = Math.floor(west / tileSizeDegrees) * tileSizeDegrees; lng <= Math.ceil(east / tileSizeDegrees) * tileSizeDegrees; lng += tileSizeDegrees) {
        const key = `${lat}/${lng}`;
        if (!tiles.value[key] && availableTiles.value.includes(key)) {
          visibleTiles.push({ lat, lng });
        }
      }
    }

    // Fetch missing tiles
    const fetchPromises = visibleTiles.map(({ lat, lng }) =>
      fetchAndAddTile(lat, lng)
    );

    await Promise.all(fetchPromises);
  }

  const allNodes = computed(() => Object.values(tiles.value).flat());

  return {
    fetchVisibleTiles,
    allNodes,
  };
});
