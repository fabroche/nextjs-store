# Shopify Integration

Esta guía explica cómo trabajar con la integración de Shopify en el proyecto.

## Arquitectura de Integración

```
Next.js App
    ↓
Services Layer (src/services/shopify/)
    ↓
Shopify Admin API (REST)
    ↓
Shopify Store
```

### Por qué esta Arquitectura?

- **Abstracción:** La capa de servicios abstrae los detalles de Shopify
- **Reutilización:** Múltiples componentes usan los mismos servicios
- **Testing:** Más fácil mockear servicios que API calls directas
- **Mantenimiento:** Cambios en Shopify API se hacen en un solo lugar

## Configuración

### Variables de Entorno

**Archivo `.env.local`:**
```bash
SHOPIFY_HOSTNAME="tu-tienda.myshopify.com"
SHOPIFY_API_KEY="shpat_xxxxxxxxxxxxxxxxxxxxx"
```

### Cómo Obtener Credenciales

1. **Accede a Shopify Admin**
   - URL: `https://tu-tienda.myshopify.com/admin`

2. **Navega a Settings → Apps and sales channels**

3. **Crea una Custom App:**
   - Click en "Develop apps"
   - "Create an app"
   - Nombre: "Next.js Store Integration"

4. **Configura Permisos (Admin API Scopes):**
   ```
   read_products           ✅
   read_product_listings   ✅
   read_collections        ✅
   read_inventory         ✅
   ```

5. **Copia el Access Token:**
   - Ve a "API credentials"
   - "Admin API access token" → Esto es tu `SHOPIFY_API_KEY`

6. **Hostname:**
   - Es tu dominio de Shopify: `tienda.myshopify.com`

### Archivo de Configuración

**src/config/env.ts:**
```ts
export const env = {
  SHOPIFY_HOSTNAME: process.env.SHOPIFY_HOSTNAME ?? '',
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ?? '',
}
```

**Validación (futuro):**
```ts
// Validar que las variables existen
if (!env.SHOPIFY_HOSTNAME || !env.SHOPIFY_API_KEY) {
  throw new Error('Missing Shopify environment variables')
}
```

## Shopify Admin API

### Versión Actual

**API Version:** `2023-07`

**Base URL:**
```
https://{SHOPIFY_HOSTNAME}/admin/api/2023-07/
```

### Autenticación

**Header requerido:**
```typescript
{
  'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
  'Content-Type': 'application/json'
}
```

### Rate Limits

Shopify tiene límites de rate:
- **REST Admin API:** 2 requests/second (bucket leak rate)
- **GraphQL:** 50 points/second

**Nuestro uso actual:** REST API (suficiente para el proyecto)

## Servicios Disponibles

### 1. Products Service

**Archivo:** `src/services/shopify/products.ts`

```typescript
import { env } from '@/config/env'
import { shopifyUrls } from './urls'

export const getProducts = async (): Promise<ProductType[]> => {
  try {
    const response = await fetch(shopifyUrls.products, {
      headers: {
        'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',  // Siempre datos frescos
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`)
    }

    const { products } = await response.json()

    return products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.body_html,
      price: parseFloat(product.variants[0].price),
      image: product.images[0]?.src || '',
      quantity: product.variants[0].inventory_quantity,
      handle: product.handle,
      tags: product.tags,
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}
```

**Uso:**
```tsx
import { getProducts } from '@/services/shopify'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  )
}
```

### 2. Collections Service

**Archivo:** `src/services/shopify/collections.ts`

```typescript
export const getCollections = async () => {
  try {
    const response = await fetch(shopifyUrls.collections, {
      headers: {
        'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
        'Content-Type': 'application/json',
      },
    })

    const { smart_collections } = await response.json()

    return smart_collections.map(collection => ({
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
    }))
  } catch (error) {
    console.error('Error fetching collections:', error)
    return []
  }
}
```

**Uso:**
```tsx
import { getCollections } from '@/services/shopify'

export default async function StoreLayout() {
  const collections = await getCollections()

  return (
    <nav>
      {collections.map(collection => (
        <Link key={collection.id} href={`/store/${collection.handle}`}>
          {collection.title}
        </Link>
      ))}
    </nav>
  )
}
```

### 3. URLs Configuration

**Archivo:** `src/services/shopify/urls.ts`

```typescript
import { env } from '@/config/env'

const SHOPIFY_BASE_URL = `https://${env.SHOPIFY_HOSTNAME}/admin/api/2023-07`

export const shopifyUrls = {
  products: `${SHOPIFY_BASE_URL}/products.json`,
  collections: `${SHOPIFY_BASE_URL}/smart_collections.json`,
  // Futuros endpoints aquí
}
```

## API Routes (Proxy)

### Por qué API Routes?

Las API Routes actúan como proxy entre el frontend y Shopify:

**Ventajas:**
- Ocultar credenciales del cliente
- Agregar caching o transformación de datos
- Rate limiting centralizado
- Logging y analytics

### Ejemplo: Products API Route

**Archivo:** `src/app/api/products/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { getProducts } from '@/services/shopify'

export async function GET(request: Request) {
  try {
    const products = await getProducts()

    return NextResponse.json(products, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('API Route error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
```

**Uso desde Client Component:**
```tsx
"use client"

import { useEffect, useState } from 'react'

export function ProductsClient() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  return <div>{products.map(...)}</div>
}
```

## Tipos de Datos

### ProductType

**Archivo:** `types.d.ts`

```typescript
type ProductType = {
  id: string
  title: string
  description: string
  price: number
  image: string
  quantity: number
  handle: string
  tags: string
}
```

### Mapeo Shopify → ProductType

**Respuesta de Shopify:**
```json
{
  "products": [{
    "id": 123456789,
    "title": "iPhone 14",
    "body_html": "<p>Description</p>",
    "variants": [{
      "price": "999.00",
      "inventory_quantity": 10
    }],
    "images": [{
      "src": "https://cdn.shopify.com/..."
    }],
    "handle": "iphone-14",
    "tags": "electronics, apple"
  }]
}
```

**Transformación:**
```typescript
{
  id: product.id.toString(),
  title: product.title,
  description: product.body_html,
  price: parseFloat(product.variants[0].price),
  image: product.images[0]?.src || '',
  quantity: product.variants[0].inventory_quantity,
  handle: product.handle,
  tags: product.tags,
}
```

## Agregar un Nuevo Servicio

### Ejemplo: Orders Service

**Paso 1: Agregar URL**

```typescript
// src/services/shopify/urls.ts
export const shopifyUrls = {
  products: `${SHOPIFY_BASE_URL}/products.json`,
  collections: `${SHOPIFY_BASE_URL}/smart_collections.json`,
  orders: `${SHOPIFY_BASE_URL}/orders.json`,  // Nuevo
}
```

**Paso 2: Crear Servicio**

```typescript
// src/services/shopify/orders.ts
import { env } from '@/config/env'
import { shopifyUrls } from './urls'

type Order = {
  id: string
  orderNumber: number
  totalPrice: string
  createdAt: string
}

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(shopifyUrls.orders, {
      headers: {
        'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`)
    }

    const { orders } = await response.json()

    return orders.map(order => ({
      id: order.id.toString(),
      orderNumber: order.order_number,
      totalPrice: order.total_price,
      createdAt: order.created_at,
    }))
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}
```

**Paso 3: Exportar**

```typescript
// src/services/shopify/index.ts
export { getProducts } from './products'
export { getCollections } from './collections'
export { getOrders } from './orders'  // Nuevo
```

**Paso 4: Usar**

```tsx
import { getOrders } from '@/services/shopify'

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>
          Order #{order.orderNumber} - ${order.totalPrice}
        </div>
      ))}
    </div>
  )
}
```

## Caching Strategies

### Server Component (Automático)

```tsx
// Por defecto, Next.js cachea fetch en Server Components
export default async function ProductsPage() {
  const products = await getProducts()  // Cacheado automáticamente
  return <ProductList products={products} />
}
```

### Revalidación

```tsx
// Revalidar cada 60 segundos
export const revalidate = 60

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductList products={products} />
}
```

### No Cache

```tsx
// src/services/shopify/products.ts
const response = await fetch(shopifyUrls.products, {
  headers: {...},
  cache: 'no-store',  // Sin cache
})
```

## Errores Comunes

### 1. Error 401: Unauthorized

**Causa:** API Key inválida o sin permisos

**Solución:**
- Verificar que `SHOPIFY_API_KEY` es correcta
- Verificar permisos de la Custom App en Shopify
- Asegurar que el token no expiró

### 2. Error 429: Too Many Requests

**Causa:** Excediste el rate limit

**Solución:**
- Implementar retry con backoff
- Agregar caching
- Reducir frecuencia de requests

```typescript
const fetchWithRetry = async (url: string, retries = 3) => {
  try {
    return await fetch(url)
  } catch (error) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000))
      return fetchWithRetry(url, retries - 1)
    }
    throw error
  }
}
```

### 3. CORS Errors

**Causa:** Intentar fetch desde cliente directamente

**Solución:**
- Usar API Routes como proxy
- Nunca exponer API key en el cliente

## Recursos

### Documentación Oficial

- **Shopify Admin API:** https://shopify.dev/docs/api/admin-rest
- **Products API:** https://shopify.dev/docs/api/admin-rest/2023-07/resources/product
- **Collections API:** https://shopify.dev/docs/api/admin-rest/2023-07/resources/collection

### Testing

**Shopify Admin:** Usa tu panel de Shopify para agregar productos de prueba

**Postman Collection:** Shopify provee colecciones de Postman para testing

---

**Anterior:** [← Coding Standards](./04-coding-standards.md)
**Siguiente:** [Troubleshooting →](./06-troubleshooting.md)
