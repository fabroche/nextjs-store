# Arquitectura del Proyecto - Next.js Shopify Store

> Documento de arquitectura y estructura del proyecto
> Última actualización: 2025-12-10

## Contexto

Este documento describe la arquitectura general del proyecto, la organización de carpetas, patrones de enrutamiento y la estructura de componentes. Sirve como guía para mantener la consistencia arquitectónica a lo largo del desarrollo.

## Información General

**Nombre:** nextjs-store
**Tipo:** E-commerce Headless Store
**Framework:** Next.js 15.5.2 (App Router)
**Arquitectura:** Jamstack con Server-Side Rendering

## Stack Tecnológico

```json
{
  "framework": "Next.js 15.5.2",
  "react": "19.1.0",
  "typescript": "5.x",
  "estilos": "SASS 1.92.1 + CSS Modules",
  "utilidades": "classnames 2.5.1",
  "cms": "Shopify Admin API 2023-07",
  "runtime": "Node.js"
}
```

## Estructura de Carpetas

```
nextjs-store/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Root layout (Header + Footer)
│   │   ├── error.tsx           # Global error boundary
│   │   ├── not-found.tsx       # Custom 404 page
│   │   │
│   │   ├── (home)/             # Route group - Home
│   │   │   ├── layout.tsx      # Hero + Description
│   │   │   ├── page.tsx        # MainProducts
│   │   │   ├── loading.tsx     # Loading state
│   │   │   └── error.tsx       # Home error boundary
│   │   │
│   │   ├── store/[[...categories]]/  # Tienda con catch-all
│   │   │   ├── layout.tsx      # Layout con navegación
│   │   │   └── page.tsx        # Listado de productos
│   │   │
│   │   ├── product/[id]/       # Detalle de producto (futuro)
│   │   │
│   │   └── api/                # API Routes
│   │       ├── route.ts        # GET /api (health check)
│   │       └── products/
│   │           └── route.ts    # GET /api/products
│   │
│   ├── components/
│   │   ├── shared/             # Componentes globales reutilizables
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── Loader/
│   │   │
│   │   ├── home/               # Componentes específicos de home
│   │   │   ├── Hero/
│   │   │   ├── Description/
│   │   │   └── MainProducts/
│   │   │
│   │   └── Store/              # Componentes de tienda
│   │       ├── ProductCard/
│   │       └── ProductsWrapper/
│   │
│   ├── services/               # Lógica de negocio y servicios externos
│   │   └── shopify/           # Integración con Shopify
│   │       ├── index.ts       # Exportaciones públicas
│   │       ├── urls.ts        # Endpoints de API
│   │       ├── products.ts    # Lógica de productos
│   │       └── collections.ts # Lógica de colecciones
│   │
│   ├── config/
│   │   └── env.ts             # Variables de entorno
│   │
│   ├── assets/
│   │   └── blurDataURLs/      # Placeholders para imágenes
│   │
│   └── sass/
│       ├── globals.sass       # Estilos globales
│       ├── main.sass          # Punto de entrada
│       ├── _variables.sass    # Variables de diseño
│       ├── global-error.module.sass
│       └── not-found.module.sass
│
├── public/
│   └── images/                # Imágenes estáticas
│       ├── 404.png
│       ├── error.png
│       └── description.jpeg
│
├── Specs/                     # Documentación técnica
│
├── types.d.ts                 # Definiciones de tipos TypeScript
├── next.config.ts             # Configuración de Next.js
├── tsconfig.json              # Configuración TypeScript
└── package.json               # Dependencias
```

## Patrones de Enrutamiento

### App Router (Next.js 13+)

El proyecto utiliza el App Router de Next.js basado en el sistema de archivos.

#### Route Groups `(nombre)`

Se utilizan para organizar rutas sin afectar la URL:

```
app/(home)/page.tsx  → Ruta: /
app/(home)/layout.tsx → Layout específico para home
```

**Ventajas:**
- Organización lógica sin impacto en URLs
- Layouts específicos por sección
- Boundaries de error aislados

#### Catch-all Routes `[[...param]]`

Para rutas dinámicas opcionales:

```
app/store/[[...categories]]/page.tsx

Coincide con:
- /store
- /store/electronics
- /store/electronics/phones
```

**Ventajas:**
- URLs flexibles sin crear múltiples archivos
- Filtrado dinámico por categorías
- Parámetros opcionales

### Jerarquía de Layouts

```
app/layout.tsx (Root Layout)
├── Global: Header, Footer, fuentes
└── Envuelve todas las páginas

app/(home)/layout.tsx (Home Layout)
├── Hero component
├── Description component
└── Solo para rutas del grupo (home)

app/store/layout.tsx (Store Layout)
├── Navegación de categorías
└── Solo para rutas de /store
```

## Patrones de Componentes

### Estructura Estándar de Componente

```
ComponentName/
├── ComponentName.tsx           # Componente principal
├── ComponentName.module.sass   # Estilos CSS Module
└── index.ts                    # Barrel export
```

### Server vs Client Components

**Server Components (por defecto):**
```typescript
// app/page.tsx
export default async function Page() {
  const data = await fetch('...')
  return <Component data={data} />
}
```

**Características:**
- Se ejecutan en el servidor
- Pueden ser async
- Acceso directo a recursos del servidor
- No incluyen JavaScript en el bundle del cliente
- No pueden usar hooks de React

**Client Components (`"use client"`):**
```typescript
// components/Counter.tsx
"use client"

import { useState } from 'react'

export const Counter = () => {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Características:**
- Se hidratan en el cliente
- Pueden usar hooks (useState, useEffect, etc.)
- Interactividad del lado del cliente
- Se incluyen en el bundle del cliente

**Distribución actual:**
- **Server:** layouts, pages principales, componentes de listado
- **Client:** Description (usa useState), componentes interactivos

### Barrel Exports

Todos los componentes exportan a través de `index.ts`:

```typescript
// components/shared/Header/index.ts
export { Header } from "./Header"
```

**Beneficios:**
- Imports más limpios: `import { Header } from '@/components/shared/Header'`
- Fácil refactorización interna
- Interfaz pública clara

## Flujos de Datos

### Home Page Flow

```
Usuario → "/"
  ↓
app/layout.tsx (Root Layout)
  ├── <Header />
  │
  ├── app/(home)/layout.tsx (Home Layout)
  │   ├── <Hero />
  │   ├── <Description />
  │   │
  │   └── app/(home)/page.tsx
  │       └── <MainProducts />
  │           ├── fetch('/api/products')
  │           │   └── API Route
  │           │       └── getProducts()
  │           │           └── Shopify API
  │           │
  │           └── Renderiza grid de productos
  │
  └── <Footer />
```

### Store Page Flow

```
Usuario → "/store" o "/store/categoria"
  ↓
app/store/[[...categories]]/layout.tsx
  ├── getCollections() → Shopify
  ├── Genera navegación de categorías
  │
  └── app/store/[[...categories]]/page.tsx
      ├── getProducts() → Shopify
      ├── Filtra por categoría según params
      │
      └── <ProductsWrapper products={filtered} />
          └── {products.map(p => <ProductCard product={p} />)}
```

### Error Handling Flow

```
Error en componente
  ↓
¿Dentro de route group?
  ├── Sí → Boundary local (ej: app/(home)/error.tsx)
  │   └── Muestra error específico de sección
  │
  └── No → Boundary global (app/error.tsx)
      └── Muestra error genérico
```

## Estrategia de Rendering

### Server-Side Rendering (SSR)

**Páginas que usan SSR:**
- Home page (`app/(home)/page.tsx`)
- Store page (`app/store/[[...categories]]/page.tsx`)

**Razones:**
- Datos dinámicos de Shopify
- SEO optimizado
- Tiempo de carga inicial rápido
- Datos siempre actualizados

### Static Generation (SG)

**Páginas estáticas:**
- Error pages (`error.tsx`, `not-found.tsx`)
- Layouts (cuando no tienen lógica dinámica)

**Razones:**
- Contenido que no cambia frecuentemente
- Performance óptima
- CDN-friendly

### Client-Side Rendering (CSR)

**Componentes con CSR:**
- Componentes interactivos (formularios, modales)
- Componentes con estado local
- Componentes que usan hooks

## Separación de Responsabilidades

### app/ - Routing y Páginas
- Define estructura de URLs
- Maneja layouts y boundaries
- Orquesta componentes
- No contiene lógica de negocio compleja

### components/ - UI Components
- Componentes reutilizables
- Presentación pura
- Reciben datos via props
- Mínima lógica de negocio

### services/ - Business Logic
- Integración con APIs externas
- Transformación de datos
- Lógica de negocio
- No contiene UI

### config/ - Configuration
- Variables de entorno
- Configuración de app
- Constants globales

## Convenciones de Nombres

### Archivos y Carpetas

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes | PascalCase | `ProductCard.tsx` |
| Utilities | camelCase | `formatPrice.ts` |
| CSS Modules | PascalCase.module.sass | `Header.module.sass` |
| API Routes | kebab-case | `route.ts` en carpeta descriptiva |
| Carpetas de componentes | PascalCase | `ProductCard/` |
| Carpetas de servicios | kebab-case o camelCase | `shopify/` |

### Código

```typescript
// Componentes: PascalCase
export const ProductCard = () => {}

// Funciones: camelCase
export const getProducts = () => {}

// Constantes: UPPER_SNAKE_CASE
export const API_VERSION = '2023-07'

// Interfaces: PascalCase con "Props" suffix para props
interface ProductCardProps {}

// Types: PascalCase con "Type" suffix
type ProductType = {}
```

## Principios Arquitectónicos

### 1. Server-First

Preferir Server Components sobre Client Components cuando sea posible:

```typescript
// ✅ Bueno: Server Component
async function ProductList() {
  const products = await getProducts()
  return <div>{products.map(...)}</div>
}

// ❌ Evitar: Client Component innecesario
"use client"
function ProductList() {
  const [products, setProducts] = useState([])
  useEffect(() => { fetchProducts() }, [])
  return <div>{products.map(...)}</div>
}
```

### 2. Colocation

Mantener archivos relacionados juntos:

```
ProductCard/
├── ProductCard.tsx
├── ProductCard.module.sass
├── ProductCard.test.tsx  (futuro)
└── index.ts
```

### 3. Single Responsibility

Cada componente/módulo debe tener una única responsabilidad:

```typescript
// ✅ Bueno: Responsabilidad única
function ProductPrice({ price }) {
  return <span>${price}</span>
}

function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.title}</h3>
      <ProductPrice price={product.price} />
    </div>
  )
}

// ❌ Evitar: Múltiples responsabilidades
function ProductCard({ product }) {
  const formatted = formatPrice(product.price)
  const discounted = calculateDiscount(product.price)
  const shipping = calculateShipping(product.weight)
  // Demasiada lógica en un componente
}
```

### 4. Composition over Configuration

Preferir composición de componentes sobre props de configuración complejas:

```typescript
// ✅ Bueno: Composición
<Card>
  <CardHeader>Título</CardHeader>
  <CardBody>Contenido</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>

// ❌ Evitar: Configuración compleja
<Card
  title="Título"
  body="Contenido"
  footer="Footer"
  showHeader={true}
  headerAlign="center"
  // ... más props
/>
```

## Consideraciones de Performance

### 1. Image Optimization

Usar `next/image` siempre:

```typescript
import Image from 'next/image'
import { blurImage } from '@/assets/blurDataURLs'

<Image
  src={product.image}
  alt={product.title}
  width={500}
  height={500}
  quality={80}
  placeholder="blur"
  blurDataURL={blurImage}
/>
```

### 2. Code Splitting

Next.js hace code splitting automático por ruta. Para componentes grandes:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loader />,
  ssr: false // si no necesita SSR
})
```

### 3. Data Fetching

Prefer Server Components para fetch de datos:

```typescript
// ✅ Server Component - fetch en servidor
async function Products() {
  const products = await getProducts()
  return <ProductList products={products} />
}

// ❌ Client Component - fetch en cliente (evitar si es posible)
"use client"
function Products() {
  const [products, setProducts] = useState([])
  useEffect(() => { /* fetch */ }, [])
}
```

## Próximas Evoluciones Arquitectónicas

### Planeadas

1. **Sistema de caché** - Implementar caché de productos con React Query o SWR
2. **Optimistic UI** - Updates optimistas para carrito de compras
3. **Streaming** - Usar Suspense boundaries para streaming de contenido
4. **Parallel Routes** - Modales y sidebars con parallel routes

### En Consideración

1. **Micro-frontends** - Si el proyecto crece significativamente
2. **Monorepo** - Si necesitamos multiple apps (admin, cliente, mobile)
3. **Edge Runtime** - Para rutas que se beneficien de edge computing

## Referencias

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Autor:** Equipo de desarrollo
**Versión:** 1.0.0
**Última revisión:** 2025-12-10