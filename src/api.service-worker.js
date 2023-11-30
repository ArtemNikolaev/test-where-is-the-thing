importScripts(
  'api/dispatcher.js',
  'api/dispatcher.utils.js',
);

(()=> {
  const request = indexedDB.open("things-db", 1);
  request.onupgradeneeded = ({target: { result: db}}) => {
    const objectStore = db.createObjectStore("data", { keyPath: "id" })

    objectStore.createIndex("id", "id", { unique: true });
  };
})()

self.addEventListener(
  'fetch',
  /** @param {FetchEvent} event */
  (event) => {
    const url = new URL(event.request.url);
    if (!isApiCall(url)) { return; }
    event.respondWith(dispatcher(event.request).then(result => new Response(JSON.stringify(result))));
  }
);
