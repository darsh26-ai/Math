// =====================================================
// Math Adventure
// Service Worker
// =====================================================

const CACHE_NAME = "math-adventure-v2";

const STATIC_FILES = [
    "./",
    "./index.html",

    // CSS
    "./css/style.css",

    // JavaScript
    "./js/app.js",
    "./js/firebase.js",

    // PWA
    "./manifest.json",

    // App Icons
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png"
];


// =====================================================
// INSTALL
// =====================================================

self.addEventListener("install", event => {

    console.log("Math Adventure: Service Worker installing...");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                console.log("Math Adventure: Caching app files...");

                return cache.addAll(STATIC_FILES);

            })
            .then(() => {

                console.log("Math Adventure: Service Worker installed.");

                return self.skipWaiting();

            })

    );

});


// =====================================================
// ACTIVATE
// =====================================================

self.addEventListener("activate", event => {

    console.log("Math Adventure: Service Worker activated.");

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames.map(cacheName => {

                        if (cacheName !== CACHE_NAME) {

                            console.log(
                                "Math Adventure: Removing old cache:",
                                cacheName
                            );

                            return caches.delete(cacheName);

                        }

                    })

                );

            })
            .then(() => {

                return self.clients.claim();

            })

    );

});


// =====================================================
// FETCH
// =====================================================

self.addEventListener("fetch", event => {

    // Only handle GET requests
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                // -----------------------------------------
                // Use cached file if available
                // -----------------------------------------

                if (cachedResponse) {

                    return cachedResponse;

                }


                // -----------------------------------------
                // Otherwise get it from the internet
                // -----------------------------------------

                return fetch(event.request)
                    .then(networkResponse => {

                        // Make a copy before returning
                        const responseClone =
                            networkResponse.clone();


                        // Cache successful responses
                        if (
                            networkResponse.status === 200 &&
                            networkResponse.type === "basic"
                        ) {

                            caches.open(CACHE_NAME)
                                .then(cache => {

                                    cache.put(
                                        event.request,
                                        responseClone
                                    );

                                });

                        }

                        return networkResponse;

                    })
                    .catch(() => {

                        console.log(
                            "Math Adventure: Network unavailable."
                        );

                    });

            })

    );

});
