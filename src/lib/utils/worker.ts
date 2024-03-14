export async function isServiceWorkerInstalled(): Promise<boolean> {
  return (await getServiceWorker()) !== undefined;
}

export async function getServiceWorker(): Promise<
  ServiceWorkerRegistration | undefined
> {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      return registration;
    } catch (error) {
      console.warn(`getServiceWorker failed with ${error}`);
    }
  }
}

export async function registerServiceWorker(
  version: string = "",
): Promise<ServiceWorkerRegistration | void> {
  if ("serviceWorker" in navigator) {
    try {
      const url = version !== "" ? `/sw.js?v=${version}` : "/sw.js";
      const registration = await navigator.serviceWorker.register(url, {
        scope: "/",
        type: "module",
        updateViaCache: "none",
      });

      if (registration.installing) {
        console.log(`Service worker installing ${version}`);
      } else if (registration.waiting) {
        console.log(`Service worker waiting ${version}`);
      } else if (registration.active) {
        console.log(`Service worker active ${version}`);
      }

      return registration;
    } catch (error) {
      console.warn(`Registration ${version} failed with ${error}`);
    }
  }

  return;
}

export async function addUrlToCache(url: string, cache: Cache): Promise<void> {
  if ((await cache.match(url)) !== undefined) {
    return Promise.resolve();
  }
  return cache.add(url);
}

export async function preloadFilesToCache(
  files: string[],
  cacheName: string,
): Promise<void[]> {
  const cache = await caches.open(cacheName);
  return Promise.all(files.map((file) => addUrlToCache(file, cache)));
}

export async function deleteCachesStartWith(name: string): Promise<boolean[]> {
  const keys = await caches.keys();
  return Promise.all(
    keys
      .filter((cacheName) => cacheName.startsWith(name))
      .map((cacheName) => caches.delete(cacheName)),
  );
}

export function isWorkerAllowed(): boolean {
  if (navigator.cookieEnabled === false) return false;
  if (!("serviceWorker" in navigator)) return false;
  return true;
}
