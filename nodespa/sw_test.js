const VERSON = 'v1', // 修改 VERSON ——> 更新缓存
    urlToCache = [ // 单页资源 初始化为空 动态添加
    ];
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(VERSON).then(cache => {
            return cache.addAll(urlToCache)
        }).then(() => self.skipWaiting())
    )
})
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            if (res)
                return res;
            else {
                let request = e.request.clone()
                return fetch(request).then(httpRes => {
                    let respondClone = httpRes.clone()
                    caches.open(VERSON).then(cache => {
                        cache.put(e.request, respondClone)
                    })
                    return httpRes
                })
            }
        })
    )
})
self.addEventListener('activate', e => {
    e.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(cacheNames => Promise.all(cacheNames.map(cacheName => {
                if (cacheName !== VERSON)
                    return caches.delete(cacheName)
            })))
        ])
    )
})