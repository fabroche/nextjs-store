# Project Overview

## Qué es este Proyecto?

**nextjs-store** es una tienda e-commerce headless que consume datos desde Shopify Admin API usando Next.js como frontend. Es una aplicación moderna que separa la capa de presentación (frontend) de la capa de datos (Shopify backend).

### Concepto Headless

En una arquitectura headless:
- **Backend (Head):** Shopify gestiona productos, inventario, checkout
- **Frontend (Body):** Next.js presenta los datos con total libertad de diseño
- **Comunicación:** API REST de Shopify

## Stack Tecnológico

```
Frontend Framework:  Next.js 15.5.2 (App Router)
UI Library:          React 19.1.0
Lenguaje:            TypeScript 5.x
Estilos:             SASS 1.92.1 + CSS Modules
Utilidades:          classnames 2.5.1
Backend/CMS:         Shopify Admin API 2023-07
Runtime:             Node.js
```

### Por qué estas Tecnologías?

| Tecnología | Razón de Uso |
|------------|--------------|
| **Next.js 15** | SSR, SSG, optimización de imágenes, routing file-based |
| **React 19** | Component-based UI, hooks, server components |
| **TypeScript** | Type safety, mejor DX, menos bugs en producción |
| **SASS + Modules** | CSS potente con scope local automático |
| **Shopify API** | Backend robusto para e-commerce sin gestionar infraestructura |

## Arquitectura General

```
┌─────────────────────────────────────────────────┐
│              USUARIO (Browser)                  │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│           Next.js Application                   │
│  ┌──────────────────────────────────────────┐   │
│  │  App Router (File-based Routing)         │   │
│  │  - / (Home)                              │   │
│  │  - /store (Catálogo)                     │   │
│  │  - /api/* (API Routes)                   │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  Components                              │   │
│  │  - Server Components (default)           │   │
│  │  - Client Components ("use client")      │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  Services Layer                          │   │
│  │  - Shopify Integration                   │   │
│  │  - Data Fetching                         │   │
│  └──────────────────────────────────────────┘   │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│        Shopify Admin API (2023-07)              │
│  - Products                                     │
│  - Collections                                  │
│  - Inventory                                    │
└─────────────────────────────────────────────────┘
```

## Estructura de Carpetas

### Vista General

```
nextjs-store/
├── src/                    # Todo el código fuente
│   ├── app/               # App Router de Next.js
│   ├── components/        # Componentes React
│   ├── services/          # Lógica de integración con APIs
│   ├── config/            # Configuración (env vars, etc)
│   ├── assets/            # Assets estáticos (blur images, etc)
│   └── sass/              # Estilos globales y variables
├── public/                # Archivos estáticos públicos
├── Specs/                 # Documentación del proyecto
└── [archivos config]      # next.config, tsconfig, etc
```

### App Directory (Routing)

```
src/app/
├── layout.tsx              # Root layout (Header + Footer)
├── error.tsx               # Global error boundary
├── not-found.tsx           # Custom 404 page
│
├── (home)/                 # Route Group - Home
│   ├── layout.tsx          # Hero + Description
│   ├── page.tsx            # MainProducts
│   ├── loading.tsx         # Loading state
│   └── error.tsx           # Home error boundary
│
├── store/[[...categories]]/  # Tienda con optional catch-all
│   ├── layout.tsx            # Layout con navegación
│   └── page.tsx              # Listado de productos
│
└── api/                    # API Routes
    ├── route.ts            # GET /api (health check)
    └── products/
        └── route.ts        # GET /api/products
```

#### Conceptos Clave del App Router

**Route Groups:** `(home)`
- No afectan la URL
- Permiten organizar layouts sin crear rutas

**Optional Catch-all:** `[[...categories]]`
- Captura 0 o más segmentos de URL
- `/store` y `/store/electronics` funcionan

**Special Files:**
- `page.tsx` → Página visible en esa ruta
- `layout.tsx` → Layout compartido
- `error.tsx` → Error boundary
- `loading.tsx` → Loading UI automático

### Components Directory

```
src/components/
├── shared/              # Componentes globales
│   ├── Header/
│   ├── Footer/
│   └── Loader/
│
├── home/                # Componentes de home
│   ├── Hero/
│   ├── Description/
│   └── MainProducts/
│
└── Store/               # Componentes de tienda
    ├── ProductCard/
    └── ProductsWrapper/
```

**Patrón de Componente:**
```
ComponentName/
├── ComponentName.tsx           # Componente
├── ComponentName.module.sass   # Estilos
└── index.ts                    # Barrel export
```

### Services Directory

```
src/services/shopify/
├── index.ts           # Exportaciones públicas
├── urls.ts            # Endpoints de API
├── products.ts        # Lógica de productos
└── collections.ts     # Lógica de colecciones
```

Esta capa abstrae la comunicación con Shopify.

## Flujo de Datos

### Ejemplo: Cargar la Home Page

```
1. Usuario → http://localhost:3000/

2. Next.js renderiza:
   ├── app/layout.tsx (Root)
   │   ├── <Header />
   │   └── app/(home)/layout.tsx
   │       ├── <Hero />
   │       ├── <Description />
   │       └── app/(home)/page.tsx
   │           └── <MainProducts />

3. MainProducts hace fetch:
   fetch('/api/products')

4. API Route (/api/products):
   ├── Llama a getProducts()
   └── getProducts() → Shopify API

5. Shopify responde con productos

6. Next.js renderiza productos en grid

7. HTML se envía al navegador
```

### Server vs Client Components

**Server Components (por defecto):**
- Se renderizan en el servidor
- Pueden hacer fetch directo de datos
- No tienen interactividad (sin useState, onClick, etc)
- Mejor performance, menos JavaScript al cliente

```tsx
// Server Component (async permitido)
export default async function ProductsPage() {
  const products = await getProducts()  // Fetch en servidor
  return <div>{products.map(...)}</div>
}
```

**Client Components (con "use client"):**
- Se hidratan en el cliente
- Pueden usar hooks (useState, useEffect, etc)
- Tienen interactividad
- Más JavaScript al cliente

```tsx
"use client"  // Directiva necesaria

export function InteractiveButton() {
  const [count, setCount] = useState(0)  // Hooks permitidos
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

## Integraciones

### Shopify Admin API

**Versión:** 2023-07
**Autenticación:** Access Token (API Key)

**Recursos utilizados:**
- `GET /products.json` - Listado de productos
- `GET /smart_collections.json` - Colecciones

**Configuración:**
- Variables en `.env.local`
- Servicios en `src/services/shopify/`
- API Routes como proxy en `src/app/api/`

## Optimizaciones

### Imágenes

- **next/image:** Optimización automática de imágenes
- **Blur placeholder:** Mejora UX durante carga
- **Remote patterns:** Permitir CDN de Shopify

### Fuentes

- **Google Fonts:** Roboto (400, 700)
- **Self-hosted:** Via Next.js font optimization
- **Preload automático:** Next.js optimiza la carga

### Estilos

- **CSS Modules:** Scope automático, no hay conflictos
- **SASS:** Variables globales pre-importadas
- **Producción:** CSS minificado y optimizado

## Conceptos Importantes

### SSR (Server-Side Rendering)
Las páginas se renderizan en el servidor en cada request. Mejor SEO y performance inicial.

### SSG (Static Site Generation)
Páginas generadas en build time. Súper rápidas. Next.js decide automáticamente.

### File-based Routing
La estructura de carpetas en `app/` define las rutas. No necesitas configurar routes manualmente.

### TypeScript Strict Mode
El proyecto usa TypeScript estricto. Evitar `any`, tipar todo correctamente.

---

**Anterior:** [← Getting Started](./01-getting-started.md)
**Siguiente:** [Development Workflow →](./03-development-workflow.md)
