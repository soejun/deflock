export const useGlobalStore = defineStore('global', () => {
  const currentLocation: Ref<[number, number] | null> = ref(null);

  const setCurrentLocation = (): Promise<[number, number]> =>
    new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            currentLocation.value = [position.coords.latitude, position.coords.longitude];
            resolve([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
            reject(error);
          },
          {
            timeout: 10000,
            enableHighAccuracy: true,
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });

  return {
    currentLocation,
    setCurrentLocation,
  };
});
