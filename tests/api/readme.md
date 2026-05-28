# To Do
Write tests that are NOT browser based to cover gaps like this:
CMS/delivery API responses — are the right fields returning?
404 handling — does the API return 404 for missing content, or 200 with empty data?
Cache headers — critical for content sites
Schema consistency — does every content item return the same structure?

tests/api/
├── stories/
│   ├── stories-schema.spec.ts        # #1 + #4
│   ├── stories-404.spec.ts           # #2
│   └── stories-cache.spec.ts         # #3
├── films/
│   ├── films-schema.spec.ts
│   ├── films-404.spec.ts
│   └── films-cache.spec.ts
├── exhibits/
│   └── ... (same pattern)
├── pages/
│   └── core-pages.spec.ts            # home, about, contact, etc.
└── locales/
  └── locale-availability.spec.ts   # /en-us/, /en-gb/, /fr-fr/