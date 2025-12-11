# Memoria de Desarrollo - Next.js Shopify Store

> Documento de contexto arquitectónico para desarrollo con Claude Code
> Última actualización: 2025-12-09

## 📋 Información General del Proyecto

**Nombre:** nextjs-store
**Tipo:** E-commerce Headless Store
**Descripción:** Tienda en línea que consume datos desde Shopify Admin API usando Next.js como frontend.

### Stack Tecnológico

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

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
nextjs-store/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Root layout (Header + Footer)
│   │   ├── error.tsx           # Global error boundary
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── (home)/             # Route group - Home
│   │   │   ├── layout.tsx      # Hero + Description
│   │   │   ├── page.tsx        # MainProducts
│   │   │   ├── loading.tsx     # Loading state
│   │   │   └── error.tsx       # Home error boundary
│   │   ├── store/[[...categories]]/  # Tienda con catch-all
│   │   │   ├── layout.tsx      # Layout con navegación
│   │   │   └── page.tsx        # Listado de productos
│   │   └── api/                # API Routes
│   │       ├── route.ts        # GET /api
│   │       └── products/
│   │           └── route.ts    # GET /api/products
│   ├── components/
│   │   ├── shared/             # Componentes globales reutilizables
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── Loader/
│   │   ├── home/               # Componentes específicos de home
│   │   │   ├── Hero/
│   │   │   ├── Description/
│   │   │   └── MainProducts/
│   │   └── Store/              # Componentes de tienda
│   │       ├── ProductCard/
│   │       └── ProductsWrapper/
│   ├── services/shopify/       # Integración con Shopify
│   │   ├── index.ts           # Exportaciones públicas
│   │   ├── urls.ts            # Endpoints de API
│   │   ├── products.ts        # Lógica de productos
│   │   └── collections.ts     # Lógica de colecciones
│   ├── config/
│   │   └── env.ts             # Variables de entorno
│   ├── assets/
│   │   └── blurDataURLs/      # Placeholders para imágenes
│   └── sass/
│       ├── globals.sass       # Estilos globales
│       ├── main.sass          # Punto de entrada
│       ├── _variables.sass    # Variables de diseño
│       ├── global-error.module.sass
│       └── not-found.module.sass
├── public/
│   └── images/                # Imágenes estáticas
│       ├── 404.png
│       ├── error.png
│       └── description.jpeg
├── types.d.ts                 # Definiciones de tipos TypeScript
├── next.config.ts             # Configuración de Next.js
├── tsconfig.json              # Configuración TypeScript
└── package.json               # Dependencias
```

---

## 🎯 Patrones y Convenciones

### 1. Componentes

#### Estructura de Componente

Cada componente sigue esta estructura:

```
ComponentName/
├── ComponentName.tsx           # Componente principal
├── ComponentName.module.sass   # Estilos CSS Module
└── index.ts                    # Barrel export
```

**Ejemplo de barrel export:**
```typescript
// index.ts
export { ComponentName } from "./ComponentName"
```

#### Server vs Client Components

**Server Components (por defecto):**
- `app/layout.tsx`
- `app/(home)/page.tsx`
- `store/[[...categories]]/layout.tsx`
- `components/home/MainProducts/MainProducts.tsx`

**Client Components (con "use client"):**
- `components/home/Description/Description.tsx` (usa useState)
- Cualquier componente que use hooks de React
- Componentes con interactividad del lado del cliente

### 2. Estilos (SASS + CSS Modules)

#### Convención de Nombres: BEM

```sass
.ComponentName
  // Estilos del bloque principal

  &__element
    // Estilos del elemento

  &--modifier
    // Estilos del modificador
```

**Ejemplo real:**
```sass
.ProductCard
  &__info
    // Información del producto

  &__priceTag
    // Etiqueta de precio

  &__link
    // Link del producto
```

#### Variables de Diseño

**Archivo:** `src/sass/_variables.sass`

```sass
// Colores principales
$color-primary: #13111a        // Fondo oscuro principal
$color-secondary: #e4e1f6      // Secundario claro
$border-color: #302c3f         // Bordes oscuros
$text-color: #fff              // Texto blanco
$main-contrast: #ff4980        // Rosa principal (contraste)

// Gradiente característico
$gradient: linear-gradient(270deg, #4f56ff, #ff4980)

// Uso del gradiente en texto
.GradientText
  background-image: $gradient
  background-clip: text
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
```

#### Importación de Estilos

```typescript
// En componentes
import styles from "./ComponentName.module.sass"

// Uso básico
<div className={styles.ComponentName}>

// Uso con classnames
import classNames from "classnames/bind"
const cx = classNames.bind(styles)

const classes = cx('Button', {
  'Button--active': isActive,
  'Button--disabled': isDisabled
})
```

### 3. TypeScript

#### Tipos Principales

**Archivo:** `types.d.ts`

```typescript
// Tipo de producto
type ProductType = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  handle: string;
  tags: string;
}

// Props de página de error
interface ErrorPageProps {
  error: Error;
  reset: () => void;
}
```

#### Convenciones de Tipado

```typescript
// Props de componente
interface ComponentNameProps {
  propName: Type;
  children?: React.ReactNode;
}

// Props de página con params dinámicos
interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

// Server Components pueden ser async
async function ServerComponent({ params }: PageProps) {
  const data = await fetchData()
  return <div>{data}</div>
}
```

---

## 🔌 Integración con Shopify

### Configuración

**Variables de entorno requeridas:**

```bash
SHOPIFY_HOSTNAME="tu-tienda.myshopify.com"
SHOPIFY_API_KEY="shpat_xxxxxxxxxxxxxxxxxxxxx"
```

**Archivo de configuración:** `src/config/env.ts`

```typescript
export const env = {
  SHOPIFY_HOSTNAME: process.env.SHOPIFY_HOSTNAME ?? '',
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ?? '',
}
```

### Servicios Disponibles

#### 1. Productos

**Archivo:** `src/services/shopify/products.ts`

```typescript
import { getProducts } from '@/services/shopify'

// Obtener todos los productos
const products = await getProducts()
// Retorna: ProductType[]
```

#### 2. Colecciones

**Archivo:** `src/services/shopify/collections.ts`

```typescript
import { getCollections } from '@/services/shopify'

// Obtener todas las colecciones
const collections = await getCollections()
// Retorna: Array<{ id, title, handle }>
```

### API Routes

#### GET /api/products

```typescript
// Uso en cliente
const response = await fetch('/api/products')
const products = await response.json()
```

#### GET /api

```typescript
// Health check
const response = await fetch('/api')
// Retorna: { message: "Hello, Next.js!" }
```

### Endpoints de Shopify

**Base URL:** `https://{SHOPIFY_HOSTNAME}/admin/api/2023-07/`

**Endpoints utilizados:**
- `/products.json` - Listado de productos
- `/smart_collections.json` - Colecciones inteligentes

**Headers requeridos:**
```typescript
{
  'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
  'Content-Type': 'application/json'
}
```

---

## 🚀 Flujos de Datos

### Home Page

```
Usuario accede a "/"
  ↓
app/layout.tsx (Root Layout)
  ├── <Header />
  ├── app/(home)/layout.tsx
  │   ├── <Hero />
  │   ├── <Description />
  │   └── app/(home)/page.tsx
  │       └── <MainProducts />
  │           ├── fetch('/api/products')
  │           │   └── getProducts()
  │           │       └── Shopify API
  │           └── Renderiza productos
  └── <Footer />
```

### Store Page

```
Usuario accede a "/store" o "/store/categoria"
  ↓
app/store/[[...categories]]/layout.tsx
  ├── getCollections() → Genera navegación de categorías
  └── app/store/[[...categories]]/page.tsx
      ├── getProducts() → Obtiene productos
      ├── Filtra por categoría (si aplica)
      └── <ProductsWrapper products={filteredProducts} />
          └── {products.map(product => <ProductCard />)}
```

### Manejo de Errores

```
Error en cualquier componente
  ↓
¿Dentro de (home)/?
  ├── Sí → app/(home)/error.tsx (Error boundary local)
  └── No → app/error.tsx (Error boundary global)
```

---

## 🎨 Sistema de Diseño

### Layouts

#### Grid de Productos (MainProducts)

```sass
display: grid
grid-template-columns: repeat(2, 1fr)
gap: 2rem
```

#### Grid Responsivo (ProductsWrapper)

```sass
display: grid
grid-template-columns: repeat(auto-fill, 320px)
gap: 2rem
justify-content: center
```

### Optimización de Imágenes

**Configuración Next.js:**

```typescript
// next.config.ts
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: 'cdn.shopify.com',
  }]
}
```

**Uso en componentes:**

```typescript
import Image from 'next/image'
import { blurImage } from '@/assets/blurDataURLs'

<Image
  src={imageUrl}
  alt="Descripción"
  width={500}
  height={500}
  quality={80}
  placeholder="blur"
  blurDataURL={blurImage}
/>
```

### Fuentes

**Google Font:** Roboto (400, 700)
**Optimización:** Self-hosted vía Next.js font optimization

```typescript
// app/layout.tsx
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})
```

---

## 📝 Guías de Desarrollo

### Crear un Nuevo Componente

1. **Crear carpeta en ubicación apropiada:**
   - `src/components/shared/` - Componente global
   - `src/components/home/` - Componente de home
   - `src/components/Store/` - Componente de tienda

2. **Estructura del componente:**

```typescript
// ComponentName/ComponentName.tsx
import styles from './ComponentName.module.sass'

interface ComponentNameProps {
  // Define props aquí
}

export const ComponentName = ({ ...props }: ComponentNameProps) => {
  return (
    <div className={styles.ComponentName}>
      {/* Contenido */}
    </div>
  )
}
```

3. **Crear estilos:**

```sass
// ComponentName/ComponentName.module.sass
.ComponentName
  // Estilos aquí

  &__element
    // Estilos de elemento
```

4. **Crear barrel export:**

```typescript
// ComponentName/index.ts
export { ComponentName } from "./ComponentName"
```

### Crear una Nueva Página

1. **Crear carpeta en `src/app/`:**

```
src/app/nueva-ruta/
├── page.tsx        # Página principal
├── layout.tsx      # Layout (opcional)
├── loading.tsx     # Loading state (opcional)
└── error.tsx       # Error boundary (opcional)
```

2. **Implementar page.tsx:**

```typescript
// Server Component (async permitido)
export default async function NuevaRutaPage() {
  const data = await fetchData()

  return (
    <div>
      {/* Contenido */}
    </div>
  )
}

// Metadata (opcional)
export const metadata = {
  title: 'Título de la página',
  description: 'Descripción',
}
```

### Agregar una API Route

1. **Crear archivo `route.ts`:**

```typescript
// src/app/api/nueva-ruta/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const data = await fetchData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error message' },
      { status: 500 }
    )
  }
}

// Otros métodos: POST, PUT, DELETE, PATCH
```

### Integrar un Nuevo Servicio de Shopify

1. **Crear archivo en `src/services/shopify/`:**

```typescript
// nuevo-servicio.ts
import { env } from '@/config/env'
import { shopifyUrls } from './urls'

export const getNuevoRecurso = async () => {
  try {
    const response = await fetch(shopifyUrls.nuevoRecurso, {
      headers: {
        'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
        'Content-Type': 'application/json'
      }
    })

    const { data } = await response.json()
    return data
  } catch (error) {
    console.log(error)
    return []
  }
}
```

2. **Agregar URL en `urls.ts`:**

```typescript
export const shopifyUrls = {
  // ...existentes
  nuevoRecurso: `https://${env.SHOPIFY_HOSTNAME}/admin/api/2023-07/nuevo.json`
}
```

3. **Exportar en `index.ts`:**

```typescript
export { getNuevoRecurso } from './nuevo-servicio'
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint

# Generar componente boilerplate
npm run generate:componentes-boilerplate
```

---

## ⚙️ Configuraciones Importantes

### next.config.ts

```typescript
{
  // Alias de paths
  experimental: {
    alias: {
      '@/*': './src/*'
    }
  },

  // SASS con variables globales pre-importadas
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/sass')],
    prependData: `@import "main.sass"`
  },

  // Optimización de imágenes
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'cdn.shopify.com'
    }]
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🚨 Errores Comunes y Soluciones

### 1. Error: "Cannot find module '@/...' "

**Causa:** Path alias no configurado correctamente

**Solución:**
- Verificar `tsconfig.json` tiene `"@/*": ["./src/*"]`
- Reiniciar TypeScript server en IDE

### 2. Error: "Headers already sent"

**Causa:** Múltiples respuestas en API Route

**Solución:**
- Asegurar un solo `return NextResponse.json()` por flujo
- Usar early returns

### 3. Imágenes de Shopify no cargan

**Causa:** `remotePatterns` no incluye CDN de Shopify

**Solución:**
- Verificar `next.config.ts` incluye `cdn.shopify.com`
- Reiniciar servidor de desarrollo

### 4. Estilos SASS no se aplican

**Causa:** Variables no disponibles o import incorrecto

**Solución:**
- Verificar `sassOptions.prependData` en `next.config.ts`
- Usar `.module.sass` en nombre de archivo
- Importar como `import styles from './file.module.sass'`

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Shopify Admin API](https://shopify.dev/docs/api/admin-rest)
- [SASS Documentation](https://sass-lang.com/documentation/)

### Endpoints de Shopify

**Versión API:** 2023-07

**Base URL:** `https://{SHOPIFY_HOSTNAME}/admin/api/2023-07/`

**Recursos usados:**
- `/products.json` - Productos
- `/smart_collections.json` - Colecciones

---

## 🎯 Próximos Pasos y TODOs

### Funcionalidades Pendientes

- [ ] Implementar carrito de compras
- [ ] Agregar paginación a listado de productos
- [ ] Implementar filtros por precio/categoría
- [ ] Agregar búsqueda de productos
- [ ] Implementar página de detalle de producto
- [ ] Agregar sistema de autenticación
- [ ] Implementar checkout con Shopify
- [ ] Agregar sistema de reviews/ratings
- [ ] Implementar wishlist
- [ ] Optimizar SEO (metadata dinámica)

### Mejoras Técnicas

- [ ] Agregar tests unitarios (Jest + React Testing Library)
- [ ] Implementar tests E2E (Playwright)
- [ ] Agregar Storybook para componentes
- [ ] Implementar caché de API (React Query o SWR)
- [ ] Agregar analytics (Google Analytics/Vercel Analytics)
- [ ] Implementar lazy loading para imágenes
- [ ] Agregar PWA support
- [ ] Optimizar bundle size
- [ ] Implementar CI/CD pipeline

### Refactoring

- [ ] Extraer lógica de fetch a custom hooks
- [ ] Crear componente genérico de Grid
- [ ] Centralizar manejo de errores
- [ ] Implementar logger centralizado
- [ ] Agregar validación de variables de entorno
- [ ] Crear helpers para formateo de precios
- [ ] Implementar skeleton loaders

---

## 📊 Estado Actual del Proyecto

**Fecha:** 2025-12-09

**Branch:** `main`

**Último commit:** `0ae40ca - feat: connecting to shopify cms store`

**Archivos staged:**
- Configuración de Next.js
- Páginas de error y loading
- Integración con Shopify
- Componentes base
- Sistema de estilos

**Estado:** ✅ En desarrollo activo

---

## 💡 Notas Importantes

1. **SIEMPRE usar Server Components** cuando sea posible para mejor performance
2. **NUNCA commitear archivos `.env`** - usar `.env.example` como template
3. **Seguir convención BEM** para nombres de clases CSS
4. **Crear barrel exports** para todos los componentes
5. **Usar TypeScript estricto** - evitar `any`
6. **Optimizar imágenes** - usar `next/image` siempre que sea posible
7. **Preferir CSS Modules** sobre estilos globales
8. **Documentar funciones complejas** con JSDoc
9. **Mantener componentes pequeños** - máximo 200 líneas
10. **No duplicar lógica** - extraer a helpers/utils si se repite

---

## 🔐 Variables de Entorno

**Archivo:** `.env.local` (no versionado)

```bash
# Shopify Configuration
SHOPIFY_HOSTNAME="tu-tienda.myshopify.com"
SHOPIFY_API_KEY="shpat_xxxxxxxxxxxxxxxxxxxxx"

# Agregar futuras variables aquí
```

**Recordar:**
- Actualizar `.env.example` cuando se agreguen nuevas variables
- Validar variables en `src/config/env.ts`
- No compartir claves en commits o mensajes

---

## 📖 Glosario

- **App Router**: Sistema de routing de Next.js 13+ basado en carpetas
- **Server Component**: Componente React que se renderiza en el servidor
- **Client Component**: Componente con directiva `"use client"`, se hidrata en cliente
- **Route Group**: Carpeta con `()` que no afecta la URL
- **Catch-all Route**: Ruta dinámica que captura todos los segmentos `[...slug]`
- **Optional Catch-all**: Ruta catch-all opcional `[[...slug]]`
- **CSS Module**: Archivo `.module.(css|sass)` con estilos scoped
- **Barrel Export**: Archivo `index.ts` que re-exporta módulos
- **BEM**: Block Element Modifier - convención de nombres CSS
- **Blur Data URL**: Imagen base64 pequeña para placeholder

---

_Este documento debe actualizarse con cada cambio arquitectónico significativo._

**Mantenido por:** Equipo de desarrollo
**Versión:** 1.0.0
