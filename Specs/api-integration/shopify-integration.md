# Integración con Shopify Admin API

> Documentación completa de la integración con Shopify
> Última actualización: 2025-12-10

## Contexto

Este documento describe la integración con Shopify Admin API, incluyendo autenticación, endpoints utilizados, transformación de datos y mejores prácticas para trabajar con la API de Shopify.

## Configuración

### Variables de Entorno

**Archivo:** `.env.local` (no versionado)

```bash
SHOPIFY_HOSTNAME="tu-tienda.myshopify.com"
SHOPIFY_API_KEY="shpat_xxxxxxxxxxxxxxxxxxxxx"
```

**Obtención de credenciales:**

1. Acceder al Admin de Shopify: `https://tu-tienda.myshopify.com/admin`
2. Ir a Settings → Apps and sales channels → Develop apps
3. Crear una nueva app privada
4. En "Configuration", otorgar permisos de lectura:
   - Products (read)
   - Collections (read)
5. Instalar la app
6. Copiar el "Admin API access token" (empieza con `shpat_`)
7. El hostname es tu dominio: `tu-tienda.myshopify.com`

### Configuración del Proyecto

**Archivo:** `src/config/env.ts`

```typescript
export const env = {
  SHOPIFY_HOSTNAME: process.env.SHOPIFY_HOSTNAME ?? '',
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ?? '',
}
```

**Validación:**
```typescript
// Agregar validación en el futuro
if (!env.SHOPIFY_HOSTNAME || !env.SHOPIFY_API_KEY) {
  throw new Error('Missing Shopify configuration')
}
```

## Versión de API

**Versión actual:** `2023-07`
**Tipo de API:** REST Admin API

**URL Base:**
```
https://{SHOPIFY_HOSTNAME}/admin/api/2023-07/
```

**Documentación oficial:**
https://shopify.dev/docs/api/admin-rest/2023-07

## Autenticación

### Headers Requeridos

```typescript
const headers = {
  'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
  'Content-Type': 'application/json'
}
```

### Ejemplo de Request

```typescript
const response = await fetch(
  `https://${env.SHOPIFY_HOSTNAME}/admin/api/2023-07/products.json`,
  {
    headers: {
      'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
      'Content-Type': 'application/json'
    }
  }
)
```

## Estructura de Servicios

### Arquitectura

```
src/services/shopify/
├── index.ts           # Exportaciones públicas
├── urls.ts            # Definición de endpoints
├── products.ts        # Servicios de productos
└── collections.ts     # Servicios de colecciones
```

### URLs (urls.ts)

```typescript
import { env } from '@/config/env'

const baseUrl = `https://${env.SHOPIFY_HOSTNAME}/admin/api/2023-07`

export const shopifyUrls = {
  products: `${baseUrl}/products.json`,
  collections: `${baseUrl}/smart_collections.json`,
  // Agregar nuevos endpoints aquí
}
```

**Beneficios:**
- Centralización de URLs
- Fácil cambio de versión de API
- DRY (Don't Repeat Yourself)

### Index (index.ts)

```typescript
// Exportaciones públicas del módulo
export { getProducts, getProductByHandle } from './products'
export { getCollections, getCollectionByHandle } from './collections'
export { shopifyUrls } from './urls'
```

**Beneficios:**
- API pública clara
- Imports limpios: `import { getProducts } from '@/services/shopify'`
- Encapsulación de implementación

## Servicios de Productos

### getProducts()

**Archivo:** `src/services/shopify/products.ts`

```typescript
import { env } from '@/config/env'
import { shopifyUrls } from './urls'

export const getProducts = async (): Promise<ProductType[]> => {
  try {
    const response = await fetch(shopifyUrls.products, {
      headers: {
        'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Siempre obtener datos frescos
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const { products } = await response.json()

    // Transformar productos de Shopify a nuestro tipo
    return products.map(transformProduct)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}
```

**Función de transformación:**

```typescript
const transformProduct = (shopifyProduct: ShopifyProduct): ProductType => {
  const firstVariant = shopifyProduct.variants[0]
  const firstImage = shopifyProduct.images[0]

  return {
    id: shopifyProduct.id.toString(),
    title: shopifyProduct.title,
    description: shopifyProduct.body_html,
    price: parseFloat(firstVariant.price),
    image: firstImage?.src || '/images/placeholder.png',
    quantity: firstVariant.inventory_quantity,
    handle: shopifyProduct.handle,
    tags: shopifyProduct.tags
  }
}
```

**Uso:**

```typescript
// En Server Component
import { getProducts } from '@/services/shopify'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Parámetros de Query (Futuro)

```typescript
interface ProductsParams {
  limit?: number;
  page?: number;
  collection_id?: string;
  product_type?: string;
  vendor?: string;
  handle?: string;
}

export const getProducts = async (
  params?: ProductsParams
): Promise<ProductType[]> => {
  const url = new URL(shopifyUrls.products)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString())
      }
    })
  }

  // ... resto del código
}
```

## Servicios de Colecciones

### getCollections()

**Archivo:** `src/services/shopify/collections.ts`

```typescript
import { env } from '@/config/env'
import { shopifyUrls } from './urls'

interface ShopifyCollection {
  id: number;
  handle: string;
  title: string;
  updated_at: string;
  body_html: string;
  published_at: string;
  sort_order: string;
  template_suffix: string | null;
  disjunctive: boolean;
  rules: Array<{
    column: string;
    relation: string;
    condition: string;
  }>;
  published_scope: string;
  admin_graphql_api_id: string;
}

export const getCollections = async () => {
  try {
    const response = await fetch(shopifyUrls.collections, {
      headers: {
        'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    const { smart_collections } = await response.json()

    return smart_collections.map((collection: ShopifyCollection) => ({
      id: collection.id,
      handle: collection.handle,
      title: collection.title
    }))
  } catch (error) {
    console.log('Error fetching collections:', error)
    return []
  }
}
```

**Uso:**

```typescript
// En layout de store
import { getCollections } from '@/services/shopify'

export default async function StoreLayout() {
  const collections = await getCollections()

  return (
    <div>
      <nav>
        {collections.map(collection => (
          <a key={collection.id} href={`/store/${collection.handle}`}>
            {collection.title}
          </a>
        ))}
      </nav>
    </div>
  )
}
```

## API Routes

### GET /api/products

**Archivo:** `src/app/api/products/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { getProducts } from '@/services/shopify'

export async function GET(request: Request) {
  try {
    const products = await getProducts()

    return NextResponse.json(products)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
```

**Uso desde cliente:**

```typescript
// En Client Component
'use client'

import { useState, useEffect } from 'react'

export function ClientProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
  }, [])

  return <div>{/* render products */}</div>
}
```

**Nota:** Preferir Server Components cuando sea posible para evitar esta API route.

## Rate Limiting

### Límites de Shopify

**REST Admin API:**
- **Bucket size:** 40 requests
- **Leak rate:** 2 requests/segundo
- **Máximo burst:** 40 requests instantáneos

**Headers de respuesta:**
```
X-Shopify-Shop-Api-Call-Limit: 32/40
Retry-After: 2.0
```

### Implementar Rate Limiting (Futuro)

```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private requestsInBucket = 40
  private lastRequestTime = Date.now()

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      if (!this.processing) {
        this.processQueue()
      }
    })
  }

  private async processQueue() {
    this.processing = true

    while (this.queue.length > 0) {
      // Calcular requests disponibles
      const now = Date.now()
      const timePassed = (now - this.lastRequestTime) / 1000
      this.requestsInBucket = Math.min(
        40,
        this.requestsInBucket + timePassed * 2
      )

      if (this.requestsInBucket >= 1) {
        const task = this.queue.shift()
        if (task) {
          this.requestsInBucket--
          this.lastRequestTime = now
          await task()
        }
      } else {
        // Esperar hasta tener al menos 1 request disponible
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    this.processing = false
  }
}

export const rateLimiter = new RateLimiter()

// Uso
export const getProducts = async () => {
  return rateLimiter.throttle(async () => {
    const response = await fetch(shopifyUrls.products, {
      headers: {
        'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  })
}
```

## Caching

### Next.js Cache Options

```typescript
// Sin caché (datos siempre frescos)
fetch(url, { cache: 'no-store' })

// Revalidar cada 60 segundos
fetch(url, { next: { revalidate: 60 } })

// Caché indefinido (solo para datos estáticos)
fetch(url, { cache: 'force-cache' })
```

### Estrategia Actual

```typescript
// products.ts
export const getProducts = async () => {
  const response = await fetch(shopifyUrls.products, {
    headers: { /* ... */ },
    cache: 'no-store' // Datos siempre frescos
  })
  // ...
}
```

### Estrategia Recomendada (Futuro)

```typescript
// Revalidar cada 5 minutos
export const getProducts = async () => {
  const response = await fetch(shopifyUrls.products, {
    headers: { /* ... */ },
    next: { revalidate: 300 } // 5 minutos
  })
  // ...
}
```

**Beneficios:**
- Reduce llamadas a API
- Mejora performance
- Respeta rate limits
- Datos relativamente frescos

### Cache Tags (Futuro)

```typescript
import { unstable_cache } from 'next/cache'

export const getProducts = unstable_cache(
  async () => {
    const response = await fetch(shopifyUrls.products, {
      headers: { /* ... */ }
    })
    const { products } = await response.json()
    return products.map(transformProduct)
  },
  ['products'], // Cache key
  {
    revalidate: 300, // 5 minutos
    tags: ['shopify-products']
  }
)

// Invalidar cache cuando sea necesario
import { revalidateTag } from 'next/cache'
revalidateTag('shopify-products')
```

## Manejo de Errores

### Tipos de Errores

1. **Errores de red:**
   ```typescript
   try {
     const response = await fetch(url)
   } catch (error) {
     // Error de red (no se pudo conectar)
     console.error('Network error:', error)
   }
   ```

2. **Errores HTTP:**
   ```typescript
   const response = await fetch(url)
   if (!response.ok) {
     // Error HTTP (404, 500, etc)
     throw new Error(`HTTP ${response.status}: ${response.statusText}`)
   }
   ```

3. **Errores de Shopify:**
   ```typescript
   const data = await response.json()
   if (data.errors) {
     // Error devuelto por Shopify
     console.error('Shopify error:', data.errors)
   }
   ```

### Implementación Robusta

```typescript
export const getProducts = async (): Promise<ProductType[]> => {
  try {
    const response = await fetch(shopifyUrls.products, {
      headers: {
        'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    // Verificar respuesta HTTP
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Shopify API error (${response.status}): ${errorText}`
      )
    }

    // Parsear JSON
    const data = await response.json()

    // Verificar errores de Shopify
    if (data.errors) {
      throw new Error(`Shopify error: ${JSON.stringify(data.errors)}`)
    }

    // Verificar que tenemos productos
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Invalid response format from Shopify')
    }

    // Transformar y retornar
    return data.products.map(transformProduct)

  } catch (error) {
    // Log del error para debugging
    console.error('Error fetching products:', error)

    // En producción, podríamos enviar a servicio de logging
    // logError(error)

    // Retornar array vacío como fallback
    // Otra opción: re-throw el error y manejarlo en el componente
    return []
  }
}
```

## Webhooks (Futuro)

### Configuración

Los webhooks permiten recibir notificaciones cuando cambian datos en Shopify.

**Eventos útiles:**
- `products/create` - Nuevo producto creado
- `products/update` - Producto actualizado
- `products/delete` - Producto eliminado
- `inventory_levels/update` - Inventario actualizado

**Implementación:**

```typescript
// app/api/webhooks/shopify/route.ts
import { headers } from 'next/headers'
import crypto from 'crypto'

export async function POST(request: Request) {
  // Verificar firma del webhook
  const headersList = headers()
  const hmac = headersList.get('X-Shopify-Hmac-Sha256')
  const topic = headersList.get('X-Shopify-Topic')

  const body = await request.text()

  // Validar HMAC
  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET!)
    .update(body, 'utf8')
    .digest('base64')

  if (hash !== hmac) {
    return new Response('Invalid signature', { status: 401 })
  }

  // Procesar webhook según topic
  const data = JSON.parse(body)

  switch (topic) {
    case 'products/update':
      // Invalidar cache del producto
      revalidateTag('shopify-products')
      break

    case 'inventory_levels/update':
      // Actualizar inventario
      break
  }

  return new Response('OK', { status: 200 })
}
```

## Próximos Pasos

### Features Planeadas

1. **GraphQL API**
   - Migrar a GraphQL para queries más eficientes
   - Reducir over-fetching de datos

2. **Paginación**
   - Implementar paginación para listados grandes
   - Usar cursor-based pagination

3. **Búsqueda**
   - Implementar búsqueda de productos
   - Usar Shopify Search API

4. **Caché inteligente**
   - Implementar cache tags
   - Revalidación selectiva

5. **Optimistic Updates**
   - Updates optimistas en el cliente
   - Mejor UX para operaciones asíncronas

## Referencias

- [Shopify Admin API Docs](https://shopify.dev/docs/api/admin-rest)
- [Shopify Rate Limits](https://shopify.dev/docs/api/usage/rate-limits)
- [Shopify Webhooks](https://shopify.dev/docs/api/admin-rest/2023-07/resources/webhook)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Autor:** Equipo de desarrollo
**Versión:** 1.0.0
**Última revisión:** 2025-12-10