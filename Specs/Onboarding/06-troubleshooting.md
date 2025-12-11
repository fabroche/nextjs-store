# Troubleshooting

Guía de solución a errores comunes y problemas frecuentes en el proyecto.

## Errores de Configuración

### Error: "Cannot find module '@/...'"

**Error completo:**
```
Error: Cannot find module '@/components/shared/Header'
```

**Causa:**
Path alias `@/` no está configurado correctamente.

**Soluciones:**

1. **Verificar tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. **Verificar next.config.ts:**
```typescript
experimental: {
  alias: {
    '@/*': './src/*'
  }
}
```

3. **Reiniciar TypeScript Server:**
   - VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
   - WebStorm: `File` → `Invalidate Caches / Restart`

4. **Reiniciar servidor de desarrollo:**
```bash
# Detener servidor (Ctrl+C)
npm run dev
```

---

### Error: "SHOPIFY_HOSTNAME is not defined"

**Error completo:**
```
TypeError: Cannot read property 'SHOPIFY_HOSTNAME' of undefined
```

**Causa:**
Variables de entorno no están configuradas.

**Soluciones:**

1. **Verificar que existe `.env.local`:**
```bash
# Windows
dir .env.local

# macOS/Linux
ls -la .env.local
```

2. **Crear `.env.local` si no existe:**
```bash
# Windows
copy .env.example .env.local

# macOS/Linux
cp .env.example .env.local
```

3. **Verificar contenido de `.env.local`:**
```bash
SHOPIFY_HOSTNAME="tu-tienda.myshopify.com"
SHOPIFY_API_KEY="shpat_xxxxxxxxxxxxxxxxxxxxx"
```

4. **Reiniciar servidor de desarrollo:**
```bash
# Las variables de entorno se cargan al inicio
npm run dev
```

---

### Error: "Headers already sent"

**Error completo:**
```
Error: Cannot set headers after they are sent to the client
```

**Causa:**
Múltiples respuestas en una API Route.

**Código problemático:**
```typescript
export async function GET(request: Request) {
  const data = await fetchData()

  NextResponse.json(data)  // Primera respuesta

  if (data.length === 0) {
    return NextResponse.json({ error: 'No data' })  // Segunda respuesta ❌
  }
}
```

**Solución:**
```typescript
export async function GET(request: Request) {
  const data = await fetchData()

  // Early return
  if (data.length === 0) {
    return NextResponse.json({ error: 'No data' })
  }

  // Solo una respuesta por flujo
  return NextResponse.json(data)
}
```

---

## Errores de Shopify

### Error: Shopify API 401 Unauthorized

**Causa:**
API Key inválida o sin permisos.

**Soluciones:**

1. **Verificar API Key:**
   - Accede a Shopify Admin
   - Settings → Apps and sales channels
   - Verifica que el token es correcto

2. **Verificar permisos de la Custom App:**
   ```
   Permisos necesarios:
   ✅ read_products
   ✅ read_product_listings
   ✅ read_collections
   ```

3. **Regenerar token si es necesario:**
   - En Shopify Admin, API credentials
   - Regenerate token
   - Actualizar `.env.local`

---

### Error: Shopify API 429 Too Many Requests

**Causa:**
Excediste el rate limit de Shopify.

**Rate limits:**
- REST API: 2 requests/second
- GraphQL: 50 points/second

**Soluciones:**

1. **Implementar caching:**
```typescript
// Server Component con revalidación
export const revalidate = 60  // Cache por 60 segundos

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductList products={products} />
}
```

2. **Agregar retry con backoff:**
```typescript
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 3,
  backoff = 1000
): Promise<Response> => {
  try {
    const response = await fetch(url, options)

    if (response.status === 429 && retries > 0) {
      await new Promise(r => setTimeout(r, backoff))
      return fetchWithRetry(url, options, retries - 1, backoff * 2)
    }

    return response
  } catch (error) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, backoff))
      return fetchWithRetry(url, options, retries - 1, backoff * 2)
    }
    throw error
  }
}
```

---

### Error: Imágenes de Shopify no cargan

**Síntomas:**
- Imágenes no se muestran
- Error 403 en consola del navegador

**Causa:**
`remotePatterns` no incluye CDN de Shopify.

**Solución:**

1. **Verificar next.config.ts:**
```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
}
```

2. **Reiniciar servidor:**
```bash
npm run dev
```

3. **Para múltiples CDNs:**
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.shopify.com',
    },
    {
      protocol: 'https',
      hostname: 'otro-cdn.com',
    },
  ],
}
```

---

## Errores de Estilos

### Error: Variables SASS no disponibles

**Síntomas:**
- Error: "Undefined variable: $color-primary"
- Estilos no se aplican

**Causa:**
Variables globales no están pre-importadas.

**Solución:**

1. **Verificar next.config.ts:**
```typescript
sassOptions: {
  includePaths: [path.join(__dirname, 'src/sass')],
  prependData: `@import "main.sass"`
}
```

2. **Verificar estructura de archivos:**
```
src/sass/
├── main.sass          # Debe importar _variables.sass
├── _variables.sass    # Definiciones de variables
└── globals.sass
```

3. **Verificar main.sass:**
```sass
@import "variables"
// Las variables ahora están disponibles globalmente
```

---

### Error: Estilos no se aplican a componente

**Causa:**
Nombre de archivo incorrecto o import mal hecho.

**Verificar:**

1. **Nombre de archivo debe ser `.module.sass`:**
```
✅ Button.module.sass
❌ Button.sass
❌ button.module.sass  (minúscula)
```

2. **Import correcto:**
```tsx
// ✅ Correcto
import styles from './Button.module.sass'

// ❌ Incorrecto
import styles from './Button.sass'
import './Button.module.sass'  // Esto no funciona
```

3. **Uso correcto:**
```tsx
// ✅ Correcto
<div className={styles.Button}>

// ❌ Incorrecto
<div className="Button">  // No tiene scope
```

---

## Errores de TypeScript

### Error: "Type 'any' is not assignable"

**Causa:**
TypeScript strict mode activo.

**Solución:**

```tsx
// ❌ Evitar any
function processData(data: any) {
  return data.items
}

// ✅ Usar tipos correctos
interface DataResponse {
  items: ProductType[]
}

function processData(data: DataResponse): ProductType[] {
  return data.items
}
```

---

### Error: "Property does not exist on type"

**Error ejemplo:**
```
Property 'title' does not exist on type 'unknown'
```

**Causa:**
Tipo no inferido correctamente.

**Solución:**

```tsx
// ❌ Tipo unknown
const handleData = (data: unknown) => {
  console.log(data.title)  // Error
}

// ✅ Type guard
const handleData = (data: unknown) => {
  if (isProduct(data)) {
    console.log(data.title)  // OK
  }
}

function isProduct(data: unknown): data is ProductType {
  return (
    typeof data === 'object' &&
    data !== null &&
    'title' in data
  )
}
```

---

## Errores de Build

### Error: Build falla con errores de TypeScript

**Causa:**
Errores de tipado que se ignoran en desarrollo.

**Solución:**

1. **Revisar errores:**
```bash
npm run build
# Ver lista completa de errores
```

2. **Corregir errores de tipado:**
```tsx
// Asegurar que todos los componentes tienen tipos
interface Props {
  title: string
}

export const Component = ({ title }: Props) => {
  // ...
}
```

3. **Verificar imports:**
```tsx
// Asegurar que todos los imports existen
import { Component } from '@/components/Component'  // ✅ Existe?
```

---

### Error: "Module not found" en build

**Causa:**
Import con capitalización incorrecta.

**Problema:**
```tsx
// Archivo real: ProductCard.tsx
import { ProductCard } from '@/components/Store/productcard'  // ❌
```

**Solución:**
```tsx
// Usar capitalización exacta
import { ProductCard } from '@/components/Store/ProductCard'  // ✅
```

**Nota:** Windows es case-insensitive, pero Linux (producción) es case-sensitive.

---

## Errores de Runtime

### Error: "Hydration mismatch"

**Error completo:**
```
Hydration failed because the initial UI does not match what was rendered on the server
```

**Causa:**
Diferencias entre render del servidor y cliente.

**Causas comunes:**

1. **Usar Date.now() directamente:**
```tsx
// ❌ Problemático
export function Component() {
  return <div>{Date.now()}</div>
}

// ✅ Usar useEffect
"use client"
export function Component() {
  const [timestamp, setTimestamp] = useState(null)

  useEffect(() => {
    setTimestamp(Date.now())
  }, [])

  return <div>{timestamp}</div>
}
```

2. **Usar window o localStorage en Server Component:**
```tsx
// ❌ Problemático
export default function Component() {
  const data = localStorage.getItem('data')  // window no existe en servidor
  return <div>{data}</div>
}

// ✅ Usar Client Component
"use client"
export default function Component() {
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(localStorage.getItem('data'))
  }, [])

  return <div>{data}</div>
}
```

---

### Error: "useState/useEffect is not defined"

**Causa:**
Usar hooks en Server Component sin "use client".

**Solución:**

```tsx
// ❌ Server Component con hooks
export function Component() {
  const [state, setState] = useState(0)  // Error
  return <div>{state}</div>
}

// ✅ Client Component
"use client"

export function Component() {
  const [state, setState] = useState(0)  // OK
  return <div>{state}</div>
}
```

---

## Problemas de Performance

### Página carga muy lento

**Diagnóstico:**

1. **Verificar tamaño de imágenes:**
```tsx
// ✅ Usar next/image con optimización
import Image from 'next/image'

<Image
  src={product.image}
  width={500}
  height={500}
  quality={80}  // Reducir si es necesario
/>
```

2. **Verificar fetch innecesarios:**
```tsx
// ❌ Fetch en cada render
export function Component() {
  const [data, setData] = useState([])

  // Sin dependencias, se ejecuta en cada render
  useEffect(() => {
    fetch('/api/data').then(...)
  })
}

// ✅ Fetch solo una vez
export function Component() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/data').then(...)
  }, [])  // Array vacío = solo al montar
}
```

3. **Usar Server Components cuando sea posible:**
```tsx
// ✅ Server Component (más rápido)
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// Solo usar Client Component si necesitas interactividad
```

---

## Debugging Tips

### 1. Revisar Consola del Navegador

**Abrir DevTools:**
- Chrome: `F12` o `Ctrl+Shift+I`
- Firefox: `F12`

**Buscar:**
- Errores en rojo
- Warnings en amarillo
- Network errors (pestaña Network)

### 2. Revisar Terminal

**Server-side errors aparecen aquí:**
```bash
npm run dev
# Observar output para errores de:
# - Compilación
# - API Routes
# - Server Components
```

### 3. Next.js Error Overlay

**En desarrollo, Next.js muestra overlay con:**
- Stack trace completo
- Archivo y línea del error
- Código fuente

### 4. Console.log Estratégico

```tsx
export async function getData() {
  console.log('1. Fetching data...')

  const response = await fetch(url)
  console.log('2. Response:', response.status)

  const data = await response.json()
  console.log('3. Data:', data)

  return data
}
```

---

## Recursos Adicionales

### Documentación

- **Next.js Errors:** https://nextjs.org/docs/messages
- **TypeScript Errors:** https://www.typescriptlang.org/docs/handbook/
- **Shopify API Errors:** https://shopify.dev/docs/api/usage/response-codes

### Comunidad

- **Next.js Discord:** https://nextjs.org/discord
- **Stack Overflow:** Tag `next.js` + `shopify`

---

**Anterior:** [← Shopify Integration](./05-shopify-integration.md)
**Inicio:** [← Volver al Índice](./README.md)
