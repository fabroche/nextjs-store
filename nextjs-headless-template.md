# Next.js Headless CMS Project Template

> Prompt para Claude 4.5 Sonnet para generar proyectos Next.js con arquitectura headless
> Versión: 1.0.0
> Última actualización: 2025-12-11

---

## 📋 OBJETIVO DEL PROMPT

Crear un proyecto Next.js completo con arquitectura headless que separe frontend (Next.js) del backend (CMS headless como Shopify, Notion, Contentful, Strapi, etc.), siguiendo decisiones arquitectónicas probadas, convenciones de código establecidas y estructura de documentación comprehensiva.

---

## 🎯 INSTRUCCIONES PARA CLAUDE

Cuando recibas una solicitud para crear un nuevo proyecto Next.js headless, sigue estos pasos:

### PASO 1: Clarificar Requisitos

Primero pregunta al usuario:

1. **Backend/CMS a utilizar** (ej: Shopify, Notion, Contentful, Strapi, Firebase)
2. **Nombre del proyecto** (ej: "nextjs-blog", "notion-portfolio")
3. **Tipo de proyecto** (ej: e-commerce, blog, portfolio, dashboard)
4. **Entidades principales** (ej: productos, posts, proyectos, usuarios)
5. **Características específicas** (ej: búsqueda, filtros, autenticación)

### PASO 2: Generar Estructura Base

Crea la estructura de carpetas completa siguiendo este template:

```
project-name/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── error.tsx           # Global error boundary
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── loading.tsx         # Global loading state
│   │   │
│   │   ├── (home)/             # Route group - Home
│   │   │   ├── layout.tsx      # Home-specific layout
│   │   │   ├── page.tsx        # Home page content
│   │   │   ├── loading.tsx     # Loading state
│   │   │   └── error.tsx       # Error boundary
│   │   │
│   │   ├── [dynamic-route]/    # Ruta dinámica (ej: /blog, /products)
│   │   │   ├── layout.tsx      # Layout con navegación
│   │   │   └── page.tsx        # Listado
│   │   │
│   │   ├── [entity]/[id]/      # Detalle (ej: /product/123)
│   │   │   └── page.tsx
│   │   │
│   │   └── api/                # API Routes
│   │       ├── route.ts        # Health check
│   │       └── [resource]/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── shared/             # Componentes globales
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Header.module.sass
│   │   │   │   └── index.ts
│   │   │   ├── Footer/
│   │   │   └── Loader/
│   │   │
│   │   ├── [section]/          # Componentes por sección
│   │   │   └── [Component]/
│   │   │       ├── Component.tsx
│   │   │       ├── Component.module.sass
│   │   │       └── index.ts
│   │   │
│   │   └── [entity]/           # Componentes de entidad
│   │       ├── [Entity]Card/
│   │       └── [Entity]List/
│   │
│   ├── services/               # Integración con backend
│   │   └── [backend-name]/     # ej: shopify, notion, contentful
│   │       ├── index.ts        # Exportaciones públicas
│   │       ├── urls.ts         # Endpoints
│   │       ├── [resource].ts   # Servicios por recurso
│   │       └── types.ts        # Tipos del backend (opcional)
│   │
│   ├── config/
│   │   └── env.ts              # Variables de entorno
│   │
│   ├── utils/                  # Utilidades (opcional)
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   ├── assets/
│   │   └── blurDataURLs/       # Placeholders para imágenes
│   │       └── index.ts
│   │
│   └── sass/
│       ├── globals.sass        # Estilos globales
│       ├── main.sass           # Punto de entrada (solo imports)
│       ├── _variables.sass     # Variables de diseño
│       ├── _mixins.sass        # Mixins (opcional)
│       └── [special].module.sass  # Estilos especiales
│
├── public/
│   └── images/                 # Imágenes estáticas
│       ├── logo.png
│       ├── 404.png
│       └── error.png
│
├── Specs/                      # Documentación técnica
│   ├── README.md              # Índice de documentación
│   │
│   ├── architecture/
│   │   ├── project-structure.md
│   │   └── component-patterns.md
│   │
│   ├── types/
│   │   └── type-definitions.md
│   │
│   ├── api-integration/
│   │   └── [backend]-integration.md
│   │
│   ├── guides/
│   │   └── styles-conventions.md
│   │
│   ├── implementation-plans/
│   │   └── (planes futuros)
│   │
│   ├── technical-analysis/
│   │   └── (análisis técnicos)
│   │
│   └── Onboarding/
│       ├── README.md
│       ├── 01-getting-started.md
│       ├── 02-project-overview.md
│       ├── 03-development-workflow.md
│       ├── 04-coding-standards.md
│       ├── 05-[backend]-integration.md
│       └── 06-troubleshooting.md
│
├── types.d.ts                  # Tipos TypeScript globales
├── next.config.ts              # Configuración de Next.js
├── tsconfig.json               # Configuración TypeScript
├── package.json                # Dependencias
├── .env.example                # Template de variables
├── .env.local                  # Variables (no versionado)
├── .gitignore
├── README.md                   # README del proyecto
└── claude.md                   # Memoria técnica para Claude Code
```

---

## 🏗️ ARQUITECTURA Y DECISIONES TÉCNICAS

### 1. Stack Tecnológico Base

```json
{
  "framework": "Next.js 15+ (App Router)",
  "react": "19+",
  "typescript": "5.x",
  "estilos": "SASS + CSS Modules",
  "utilidades": "classnames",
  "cms": "[BACKEND_SELECCIONADO]",
  "runtime": "Node.js"
}
```

### 2. Principios Arquitectónicos

#### A. Separación de Responsabilidades

```
app/              → Routing, layouts, orchestration
components/       → UI presentacional
services/         → Lógica de negocio, integración con backend
config/           → Configuración
utils/            → Utilidades puras
```

#### B. Server-First Approach

**Regla:** Usar Server Components por defecto. Solo Client Components cuando se necesite:
- Hooks de React (useState, useEffect, etc.)
- Interactividad del lado del cliente
- APIs del navegador (localStorage, window, etc.)

```typescript
// ✅ Server Component (por defecto)
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductList products={products} />
}

// ✅ Client Component (solo cuando sea necesario)
"use client"
export function InteractiveCart() {
  const [items, setItems] = useState([])
  return <div>...</div>
}
```

#### C. Headless Architecture

```
┌─────────────────────────────────┐
│   Usuario (Browser)             │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Next.js Application           │
│   (Frontend)                    │
│   ┌─────────────────────────┐   │
│   │  App Router             │   │
│   │  Components             │   │
│   │  Services Layer         │   │
│   └─────────────────────────┘   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Headless Backend/CMS          │
│   (Shopify, Notion, etc.)       │
└─────────────────────────────────┘
```

**Beneficios:**
- Frontend y backend desacoplados
- Flexibilidad para cambiar backend
- Múltiples frontends posibles
- Mejor performance (SSR + SSG)

---

## 📝 CONVENCIONES DE CÓDIGO

### 1. TypeScript

#### Tipos Principales

```typescript
// types.d.ts - Definir tipos globales del proyecto

// Props de Error Pages
interface ErrorPageProps {
  error: Error
  reset: () => void
}

// Tipo principal de entidad (ej: Product, Post, Project)
type [Entity]Type = {
  id: string
  title: string
  description: string
  // ... campos específicos
}

// Tipos del backend (raw data)
interface [Backend][Entity] {
  // Estructura exacta de la API del backend
}
```

#### Convenciones

- **Interfaces vs Types:**
  - `interface` para props de componentes y objetos extensibles
  - `type` para uniones, aliases y tipos de datos

- **Nomenclatura:**
  - Props: `ComponentNameProps`
  - Tipos de datos: `EntityType`
  - Tipos de backend: `[Backend][Entity]` (ej: `ShopifyProduct`)

- **Evitar `any`:** Siempre tipar explícitamente

### 2. SASS y CSS Modules

#### Metodología BEM

```sass
.ComponentName              // Block
  // Estilos del bloque

  &__element               // Element
    // Estilos del elemento

  &--modifier              // Modifier
    // Variante del bloque
```

#### Estructura de Archivo

```sass
// ComponentName.module.sass
.ComponentName
  // 1. Positioning
  position: relative

  // 2. Box model
  display: flex
  padding: $spacing-md

  // 3. Typography
  font-size: $font-base
  color: $text-color

  // 4. Visual
  background: $color-primary
  border-radius: $border-radius-md

  // 5. Misc
  transition: all $transition-base

  // 6. Elements y modifiers
  &__element
    // ...

  &--modifier
    // ...
```

#### Sistema de Variables (_variables.sass)

```sass
// Colores
$color-primary: #13111a
$color-secondary: #e4e1f6
$border-color: #302c3f
$text-color: #fff
$main-contrast: #ff4980

// Gradiente
$gradient: linear-gradient(270deg, #4f56ff, #ff4980)

// Tipografía
$font-base: 1rem
$font-lg: 1.25rem
$font-xl: 1.5rem

// Espaciado
$spacing-sm: 0.5rem
$spacing-md: 1rem
$spacing-lg: 1.5rem
$spacing-xl: 2rem

// Layout
$container-xl: 1280px

// Breakpoints
$breakpoint-sm: 640px
$breakpoint-md: 768px
$breakpoint-lg: 1024px

// Borders
$border-radius-sm: 4px
$border-radius-md: 8px
$border-radius-lg: 12px

// Transiciones
$transition-fast: 150ms ease-in-out
$transition-base: 250ms ease-in-out
```

#### Configuración Next.js

```typescript
// next.config.ts
import path from 'path'

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/sass')],
    prependData: `@import "main.sass"`  // Variables globales
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '[CDN_DEL_BACKEND]', // ej: cdn.shopify.com
      }
    ]
  }
}
```

### 3. Componentes

#### Estructura Estándar

```
ComponentName/
├── ComponentName.tsx           # Componente
├── ComponentName.module.sass   # Estilos
└── index.ts                    # Barrel export
```

**ComponentName.tsx:**
```typescript
import styles from './ComponentName.module.sass'

interface ComponentNameProps {
  // Props aquí
}

export const ComponentName = ({ ...props }: ComponentNameProps) => {
  return (
    <div className={styles.ComponentName}>
      {/* Contenido */}
    </div>
  )
}
```

**index.ts:**
```typescript
export { ComponentName } from './ComponentName'
```

#### Uso de classnames

```typescript
import classNames from 'classnames/bind'
import styles from './Component.module.sass'

const cx = classNames.bind(styles)

export const Component = ({ active, variant }) => {
  const classes = cx('Component', {
    'Component--active': active,
    'Component--primary': variant === 'primary'
  })

  return <div className={classes}>...</div>
}
```

---

## 🔌 CAPA DE SERVICIOS (Services Layer)

### Estructura

```
services/[backend]/
├── index.ts           # Exportaciones públicas
├── urls.ts            # Endpoints
├── [resource].ts      # Servicios por recurso
└── types.ts          # Tipos (opcional si están en types.d.ts)
```

### Implementación

#### 1. urls.ts

```typescript
import { env } from '@/config/env'

const BASE_URL = `https://[BACKEND_API_URL]`

export const [backend]Urls = {
  [resource]: `${BASE_URL}/[endpoint]`,
  [anotherResource]: `${BASE_URL}/[endpoint]`,
}
```

#### 2. [resource].ts

```typescript
import { env } from '@/config/env'
import { [backend]Urls } from './urls'

// Tipo del backend (raw)
interface [Backend][Resource] {
  // Estructura de la API
}

// Función de transformación
const transform[Resource] = (
  raw: [Backend][Resource]
): [Resource]Type => {
  return {
    id: raw.id.toString(),
    title: raw.title,
    // ... transformar campos
  }
}

// Servicio principal
export const get[Resources] = async (): Promise<[Resource]Type[]> => {
  try {
    const response = await fetch([backend]Urls.[resource], {
      headers: {
        'Authorization': `Bearer ${env.[BACKEND]_API_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // o revalidate según necesidad
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return data.[resources].map(transform[Resource])
  } catch (error) {
    console.error('Error fetching [resources]:', error)
    return []  // Fallback
  }
}
```

#### 3. index.ts

```typescript
export { get[Resources], get[Resource]ById } from './[resource]'
export { [backend]Urls } from './urls'
```

### Configuración de Entorno

**config/env.ts:**
```typescript
export const env = {
  [BACKEND]_API_URL: process.env.[BACKEND]_API_URL ?? '',
  [BACKEND]_API_KEY: process.env.[BACKEND]_API_KEY ?? '',
}

// Validación (opcional pero recomendado)
const validateEnv = () => {
  const required = [
    '[BACKEND]_API_URL',
    '[BACKEND]_API_KEY'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`)
  }
}

// validateEnv() // Descomentar en producción
```

**.env.example:**
```bash
# [Backend Name] Configuration
[BACKEND]_API_URL="https://api.backend.com"
[BACKEND]_API_KEY="your_api_key_here"

# Agregar instrucciones de cómo obtener credenciales
```

---

## 📚 ESTRUCTURA DE DOCUMENTACIÓN (Specs/)

### Specs/README.md

```markdown
# Especificaciones Técnicas - [Proyecto Name]

> Documentación técnica y arquitectónica del proyecto
> Última actualización: YYYY-MM-DD

## Propósito

Memoria de desarrollo y referencia para decisiones arquitectónicas.

## Estructura

- **architecture/** - Arquitectura del proyecto
- **types/** - Tipos TypeScript
- **api-integration/** - Integración con backend
- **guides/** - Guías de desarrollo
- **implementation-plans/** - Planes de features
- **technical-analysis/** - Análisis técnicos
- **Onboarding/** - Documentación para nuevos devs

## Convenciones

1. Nombres: kebab-case
2. Formato: Markdown
3. Fecha: ISO (YYYY-MM-DD)
4. Actualizar al cambiar arquitectura
```

### Specs/architecture/project-structure.md

**Contenido:**
- Stack tecnológico completo
- Estructura de carpetas detallada
- Patrones de enrutamiento (App Router)
- Patrones de componentes
- Server vs Client Components
- Flujos de datos con diagramas ASCII
- Estrategias de rendering (SSR, SSG, CSR)
- Separación de responsabilidades
- Convenciones de nombres
- Principios arquitectónicos
- Consideraciones de performance

### Specs/types/type-definitions.md

**Contenido:**
- Tipos principales del proyecto
- Tipos del backend (raw API)
- Jerarquía de tipos
- Transformaciones de datos
- Convenciones de tipado
- Ejemplos de uso
- Mock data para testing

### Specs/api-integration/[backend]-integration.md

**Contenido:**
- Configuración (credenciales, setup)
- Versión de API utilizada
- Autenticación
- Estructura de servicios
- Servicios disponibles con ejemplos
- API Routes (si aplica)
- Rate limiting
- Caching strategies
- Manejo de errores
- Webhooks (si aplica)
- Referencias a docs oficiales

### Specs/guides/styles-conventions.md

**Contenido:**
- Metodología BEM
- CSS Modules
- Librería classnames
- Variables de diseño
- Estilos globales
- Patrones de diseño (cards, grids, buttons)
- Responsive design
- Mejores prácticas
- Performance

### Specs/Onboarding/

**Archivos requeridos:**

1. **README.md** - Índice navegable
2. **01-getting-started.md** - Setup, instalación, primer run
3. **02-project-overview.md** - Stack, arquitectura general
4. **03-development-workflow.md** - Crear componentes, páginas, API routes
5. **04-coding-standards.md** - Convenciones TS, SASS, naming
6. **05-[backend]-integration.md** - Cómo trabajar con el backend
7. **06-troubleshooting.md** - Errores comunes y soluciones

---

## 🎨 ARCHIVOS DE CONFIGURACIÓN

### package.json

```json
{
  "name": "[project-name]",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sass": "^1.92.0",
    "classnames": "^2.5.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### next.config.ts

```typescript
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // SASS con variables globales
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/sass')],
    prependData: `@import "main.sass"`
  },

  // Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '[CDN_HOSTNAME]',
      }
    ]
  }
}

export default nextConfig
```

### .gitignore

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## 📋 README.md DEL PROYECTO

```markdown
# [Project Name]

> [Breve descripción del proyecto]

## Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19
- **Lenguaje:** TypeScript 5
- **Estilos:** SASS + CSS Modules (BEM)
- **Backend:** [Backend Name]

## Requisitos Previos

- Node.js 18+
- npm 9+
- Cuenta en [Backend Name]

## Setup

1. **Clonar repositorio:**
   bash
   git clone [repo-url]
   cd [project-name]


2. **Instalar dependencias:**
   bash
   npm install


3. **Configurar variables de entorno:**
   bash
   cp .env.example .env.local


   Editar `.env.local` con tus credenciales.

4. **Ejecutar en desarrollo:**
   bash
   npm run dev


   Abrir [http://localhost:3000](http://localhost:3000)

## Comandos

bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm start            # Servidor de producción
npm run lint         # Linting


## Estructura del Proyecto

[Breve explicación de carpetas principales]

## Documentación

Ver `/Specs/Onboarding/README.md` para guía completa de onboarding.

## Licencia

[Licencia del proyecto]
```

---

## 🚀 claude.md (Memoria Técnica)

```markdown
# Memoria de Desarrollo - [Project Name]

> Documento de contexto arquitectónico para desarrollo con Claude Code
> Última actualización: YYYY-MM-DD

## Información General

**Nombre:** [project-name]
**Tipo:** [tipo de proyecto]
**Descripción:** [descripción detallada]

### Stack Tecnológico

[Stack completo en formato JSON]

## Arquitectura del Proyecto

[Estructura de carpetas con explicaciones]

## Patrones y Convenciones

### 1. Componentes
[Estructura, Server vs Client, Barrel exports]

### 2. Estilos (SASS + CSS Modules)
[BEM, variables, imports]

### 3. TypeScript
[Tipos principales, convenciones]

## Integración con [Backend]

[Configuración, servicios, ejemplos]

## Flujos de Datos

[Diagramas de flujo principales]

## Comandos Útiles

[Lista de comandos]

## Configuraciones Importantes

[next.config, tsconfig, etc.]

## Errores Comunes y Soluciones

[Top 5-10 errores]

## Próximos Pasos y TODOs

[Features pendientes y mejoras]

---

_Este documento debe actualizarse con cada cambio arquitectónico significativo._
```

---

## ✅ CHECKLIST DE GENERACIÓN

Al crear un proyecto, asegúrate de:

### Estructura Base
- [ ] Crear estructura completa de carpetas
- [ ] Configurar package.json con dependencias
- [ ] Configurar tsconfig.json con path alias
- [ ] Configurar next.config.ts con SASS y images
- [ ] Crear .gitignore
- [ ] Crear .env.example con todas las variables

### Archivos Esenciales
- [ ] types.d.ts con tipos principales
- [ ] src/app/layout.tsx (root layout)
- [ ] src/app/page.tsx (home page)
- [ ] src/app/error.tsx (global error boundary)
- [ ] src/app/not-found.tsx (404 page)

### Componentes Base
- [ ] Header componente
- [ ] Footer componente
- [ ] Loader componente
- [ ] Cada uno con .tsx + .module.sass + index.ts

### Estilos
- [ ] src/sass/_variables.sass con sistema de diseño
- [ ] src/sass/main.sass (solo imports)
- [ ] src/sass/globals.sass con reset y estilos base

### Servicios
- [ ] src/services/[backend]/index.ts
- [ ] src/services/[backend]/urls.ts
- [ ] src/services/[backend]/[resource].ts
- [ ] src/config/env.ts

### Documentación (Specs/)
- [ ] Specs/README.md
- [ ] Specs/architecture/project-structure.md
- [ ] Specs/types/type-definitions.md
- [ ] Specs/api-integration/[backend]-integration.md
- [ ] Specs/guides/styles-conventions.md
- [ ] Specs/Onboarding/README.md
- [ ] Specs/Onboarding/01-getting-started.md
- [ ] Specs/Onboarding/02-project-overview.md
- [ ] Specs/Onboarding/03-development-workflow.md
- [ ] Specs/Onboarding/04-coding-standards.md
- [ ] Specs/Onboarding/05-[backend]-integration.md
- [ ] Specs/Onboarding/06-troubleshooting.md

### Raíz
- [ ] README.md del proyecto
- [ ] claude.md (memoria técnica)

---

## 🎨 EJEMPLOS POR BACKEND

### Shopify

**Variables de entorno:**
```bash
SHOPIFY_HOSTNAME="tienda.myshopify.com"
SHOPIFY_API_KEY="shpat_xxxxx"
```

**Servicio:**
```typescript
// services/shopify/products.ts
export const getProducts = async (): Promise<ProductType[]> => {
  const response = await fetch(shopifyUrls.products, {
    headers: {
      'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
      'Content-Type': 'application/json'
    }
  })
  // ...
}
```

### Notion

**Variables:**
```bash
NOTION_API_KEY="secret_xxxxx"
NOTION_DATABASE_ID="xxxxx"
```

**Servicio:**
```typescript
// services/notion/posts.ts
import { Client } from '@notionhq/client'

const notion = new Client({ auth: env.NOTION_API_KEY })

export const getPosts = async (): Promise<PostType[]> => {
  const response = await notion.databases.query({
    database_id: env.NOTION_DATABASE_ID
  })
  // ...
}
```

### Contentful

**Variables:**
```bash
CONTENTFUL_SPACE_ID="xxxxx"
CONTENTFUL_ACCESS_TOKEN="xxxxx"
```

**Servicio:**
```typescript
// services/contentful/entries.ts
import { createClient } from 'contentful'

const client = createClient({
  space: env.CONTENTFUL_SPACE_ID,
  accessToken: env.CONTENTFUL_ACCESS_TOKEN
})

export const getEntries = async (): Promise<EntryType[]> => {
  const response = await client.getEntries({ content_type: 'blogPost' })
  // ...
}
```

---

## 🔍 VALIDACIÓN FINAL

Antes de entregar el proyecto, verifica:

1. **Compila sin errores:** `npm run build`
2. **TypeScript sin errores:** No debe haber errores de tipado
3. **Todas las variables de entorno documentadas** en .env.example
4. **Documentación completa** en Specs/
5. **README.md claro** con instrucciones de setup
6. **claude.md actualizado** con contexto completo
7. **Barrel exports** en todos los componentes
8. **BEM** consistente en todos los estilos
9. **Server Components** por defecto, Client solo cuando necesario
10. **Servicios** bien estructurados con manejo de errores

---

## 📚 RECURSOS Y REFERENCIAS

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SASS Documentation](https://sass-lang.com/documentation/)
- [BEM Methodology](https://getbem.com/)
- [CSS Modules](https://github.com/css-modules/css-modules)

---

## 🎯 EJEMPLO DE USO DEL PROMPT

**Usuario:** "Crea un proyecto Next.js con Notion como backend para un blog personal"

**Claude debe:**
1. Clarificar: entidades (posts, projects), features necesarias
2. Generar estructura completa
3. Configurar integración con Notion API
4. Crear componentes: PostCard, PostList, etc.
5. Generar toda la documentación en Specs/
6. Crear archivos de configuración
7. Proporcionar instrucciones de setup

---

**FIN DEL TEMPLATE**

Este prompt debe resultar en un proyecto Next.js completo, production-ready, con arquitectura sólida y documentación comprehensiva que facilite onboarding y mantenimiento a largo plazo.
