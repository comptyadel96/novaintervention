import type { LatLng } from "@/lib/maps/config";

export function geolocationErrorMessage(code?: number): string {
  if (code === 1) {
    return "Autorisez la localisation (icône cadenas dans la barre d'adresse), puis réessayez.";
  }
  if (code === 2) {
    return "Position GPS indisponible. Activez la localisation du téléphone, puis réessayez.";
  }
  if (code === 3) {
    return "La localisation a pris trop de temps. Réessayez ou saisissez l'adresse.";
  }
  return "Impossible d'obtenir votre position. Saisissez l'adresse ou réessayez.";
}

export function requestBrowserPosition(): Promise<LatLng> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("La géolocalisation n'est pas supportée sur cet appareil."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => {
        const error = new Error(geolocationErrorMessage(err.code));
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20_000,
        maximumAge: 30_000,
      },
    );
  });
}
