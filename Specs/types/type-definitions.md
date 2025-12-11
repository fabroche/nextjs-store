# Definiciones de Tipos TypeScript

> Documentación completa de tipos y estructuras de datos del proyecto
> Última actualización: 2025-12-10

## Contexto

Este documento describe todos los tipos TypeScript utilizados en el proyecto, sus propósitos, relaciones y ejemplos de uso. Los tipos están definidos en `types.d.ts` en la raíz del proyecto.

## Tipos Principales

### ErrorPageProps

**Propósito:** Props para páginas de error (error boundaries)

**Ubicación:** `types.d.ts:1-4`

```typescript
interface ErrorPageProps {
    error: Error;
    reset: () => void;
}
```

**Campos:**
- `error`: Objeto Error que contiene información del error capturado
- `reset`: Función para intentar recuperarse del error re-renderizando el segmento

**Uso:**
```typescript
// app/error.tsx
'use client'

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div>
      <h2>Algo salió mal</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Intentar de nuevo</button>
    </div>
  )
}
```

**Relaciones:**
- Usado en todos los archivos `error.tsx` del proyecto
- Cumple con la API de Error Boundaries de Next.js

---

### ProductType

**Propósito:** Representación simplificada de un producto para el frontend

**Ubicación:** `types.d.ts:6-15`

```typescript
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
```

**Campos:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` | Identificador único del producto |
| `title` | `string` | Nombre del producto |
| `description` | `string` | Descripción HTML del producto |
| `price` | `number` | Precio del producto (primera variante) |
| `image` | `string` | URL de la imagen principal |
| `quantity` | `number` | Cantidad disponible en inventario |
| `handle` | `string` | Slug URL-friendly del producto |
| `tags` | `string` | Tags separados por comas |

**Uso:**
```typescript
// components/Store/ProductCard/ProductCard.tsx
interface ProductCardProps {
  product: ProductType;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article>
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <img src={product.image} alt={product.title} />
    </article>
  )
}
```

**Transformación desde Shopify:**
```typescript
// services/shopify/products.ts
const transformProduct = (shopifyProduct: ShopifyProduct): ProductType => {
  return {
    id: shopifyProduct.id.toString(),
    title: shopifyProduct.title,
    description: shopifyProduct.body_html,
    price: parseFloat(shopifyProduct.variants[0].price),
    image: shopifyProduct.images[0]?.src || '',
    quantity: shopifyProduct.variants[0].inventory_quantity,
    handle: shopifyProduct.handle,
    tags: shopifyProduct.tags
  }
}
```

**Relaciones:**
- Transformado desde `ShopifyProduct`
- Usado en componentes de UI
- Devuelto por servicios de productos

---

## Tipos de Shopify API

### ShopifyProduct

**Propósito:** Representación completa de un producto de la Shopify Admin API

**Ubicación:** `types.d.ts:69-88`

```typescript
interface ShopifyProduct {
    id: number;
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    created_at: string;
    handle: string;
    updated_at: string;
    published_at: string;
    template_suffix: string | null;
    published_scope: string;
    tags: string;
    status: string;
    admin_graphql_api_id: string;
    variants: ShopifyProductVariant[];
    options: ShopifyProductOption[];
    images: ShopifyProductImage[];
    image: ShopifyProductImage | null;
}
```

**Campos Principales:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `number` | ID numérico del producto en Shopify |
| `title` | `string` | Título del producto |
| `body_html` | `string` | Descripción en HTML |
| `vendor` | `string` | Proveedor/marca del producto |
| `product_type` | `string` | Tipo de producto (ej: "Electronics") |
| `handle` | `string` | URL slug del producto |
| `tags` | `string` | Tags separados por comas |
| `status` | `string` | Estado: "active", "draft", "archived" |
| `variants` | `ShopifyProductVariant[]` | Array de variantes |
| `options` | `ShopifyProductOption[]` | Array de opciones (talla, color, etc) |
| `images` | `ShopifyProductImage[]` | Array de imágenes |
| `image` | `ShopifyProductImage \| null` | Imagen principal |

**Campos de Metadata:**
- `created_at`: Fecha de creación ISO 8601
- `updated_at`: Fecha de última actualización ISO 8601
- `published_at`: Fecha de publicación ISO 8601
- `published_scope`: Ámbito de publicación (ej: "global", "web")
- `template_suffix`: Sufijo de template personalizado
- `admin_graphql_api_id`: ID GraphQL del producto

**Uso:**
```typescript
// services/shopify/products.ts
export const getProducts = async (): Promise<ProductType[]> => {
  const response = await fetch(shopifyUrls.products)
  const { products }: { products: ShopifyProduct[] } = await response.json()

  return products.map(transformProduct)
}
```

**Ejemplo de datos reales:**
```json
{
  "id": 15165064118598,
  "title": "Automóvil Eléctrico de Núcleo Único",
  "body_html": "<p>El futuro de la movilidad...</p>",
  "vendor": "Future World",
  "product_type": "",
  "handle": "automovil-electrico-de-nucleo-unico",
  "tags": "Movilidad Eléctrica y Vehículos Autónomos",
  "status": "active",
  "variants": [...],
  "images": [...],
  "image": {...}
}
```

---

### ShopifyProductVariant

**Propósito:** Representa una variante específica de un producto (talla, color, etc.)

**Ubicación:** `types.d.ts:18-45`

```typescript
interface ShopifyProductVariant {
    id: number;
    product_id: number;
    title: string;
    price: string;
    position: number;
    inventory_policy: string;
    compare_at_price: string | null;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    created_at: string;
    updated_at: string;
    taxable: boolean;
    barcode: string | null;
    fulfillment_service: string;
    grams: number;
    inventory_management: string | null;
    requires_shipping: boolean;
    sku: string | null;
    weight: number;
    weight_unit: string;
    inventory_item_id: number;
    inventory_quantity: number;
    old_inventory_quantity: number;
    admin_graphql_api_id: string;
    image_id: number | null;
}
```

**Campos de Precio:**
- `price`: Precio como string (ej: "36.18")
- `compare_at_price`: Precio de comparación (antes de descuento)

**Campos de Inventario:**
- `inventory_quantity`: Cantidad disponible actual
- `old_inventory_quantity`: Cantidad anterior
- `inventory_management`: Sistema de gestión de inventario
- `inventory_policy`: Política ("deny" = no vender sin stock)

**Campos de Opciones:**
- `option1`, `option2`, `option3`: Valores de opciones (ej: "Rojo", "XL")
- `title`: Combinación de opciones como texto

**Campos de Envío:**
- `requires_shipping`: Si requiere envío físico
- `weight`: Peso numérico
- `weight_unit`: Unidad de peso ("kg", "lb", etc)
- `grams`: Peso en gramos

**Uso:**
```typescript
// Obtener precio de la primera variante
const price = parseFloat(product.variants[0].price)

// Verificar disponibilidad
const isAvailable = product.variants.some(v => v.inventory_quantity > 0)

// Obtener variante por opciones
const variant = product.variants.find(v =>
  v.option1 === "Rojo" && v.option2 === "XL"
)
```

---

### ShopifyProductOption

**Propósito:** Define una opción de producto (ej: Color, Talla)

**Ubicación:** `types.d.ts:47-53`

```typescript
interface ShopifyProductOption {
    id: number;
    product_id: number;
    name: string;
    position: number;
    values: string[];
}
```

**Campos:**
- `name`: Nombre de la opción (ej: "Color", "Talla", "Material")
- `values`: Array de valores posibles (ej: ["Rojo", "Azul", "Verde"])
- `position`: Orden de la opción (1, 2, 3)

**Ejemplo:**
```typescript
// Producto con opciones de Color y Talla
{
  options: [
    {
      id: 1,
      name: "Color",
      position: 1,
      values: ["Rojo", "Azul", "Verde"]
    },
    {
      id: 2,
      name: "Talla",
      position: 2,
      values: ["S", "M", "L", "XL"]
    }
  ]
}
```

**Uso:**
```typescript
// Generar selector de opciones
{product.options.map(option => (
  <div key={option.id}>
    <label>{option.name}</label>
    <select>
      {option.values.map(value => (
        <option key={value} value={value}>{value}</option>
      ))}
    </select>
  </div>
))}
```

---

### ShopifyProductImage

**Propósito:** Representa una imagen de producto

**Ubicación:** `types.d.ts:55-67`

```typescript
interface ShopifyProductImage {
    id: number;
    alt: string | null;
    position: number;
    product_id: number;
    created_at: string;
    updated_at: string;
    admin_graphql_api_id: string;
    width: number;
    height: number;
    src: string;
    variant_ids: number[];
}
```

**Campos Principales:**
- `src`: URL de la imagen (CDN de Shopify)
- `alt`: Texto alternativo para accesibilidad
- `width`, `height`: Dimensiones originales de la imagen
- `position`: Orden de la imagen en la galería
- `variant_ids`: IDs de variantes asociadas a esta imagen

**Uso:**
```typescript
// Mostrar imagen principal
import Image from 'next/image'

const mainImage = product.images[0]

<Image
  src={mainImage.src}
  alt={mainImage.alt || product.title}
  width={mainImage.width}
  height={mainImage.height}
/>
```

```typescript
// Galería de imágenes
{product.images.map(image => (
  <img
    key={image.id}
    src={image.src}
    alt={image.alt || product.title}
    width={200}
    height={200}
  />
))}
```

**Formato de URL:**
```
https://cdn.shopify.com/s/files/1/[store-id]/[file-id]/[filename].jpg?v=[version]
```

---

## Jerarquía de Tipos

```
ShopifyProduct (Datos crudos de API)
├── ShopifyProductVariant[] (Variantes del producto)
├── ShopifyProductOption[] (Opciones: Color, Talla, etc)
└── ShopifyProductImage[] (Imágenes del producto)

    ↓ Transformación

ProductType (Datos simplificados para UI)
```

## Transformaciones de Datos

### Shopify → ProductType

```typescript
const transformShopifyProduct = (
  shopifyProduct: ShopifyProduct
): ProductType => {
  const firstVariant = shopifyProduct.variants[0]
  const firstImage = shopifyProduct.images[0]

  return {
    id: shopifyProduct.id.toString(),
    title: shopifyProduct.title,
    description: shopifyProduct.body_html,
    price: parseFloat(firstVariant.price),
    image: firstImage?.src || '',
    quantity: firstVariant.inventory_quantity,
    handle: shopifyProduct.handle,
    tags: shopifyProduct.tags
  }
}
```

**Decisiones de transformación:**
1. **ID**: Convertido de `number` a `string` para consistencia
2. **Price**: Se usa la primera variante y se parsea a `number`
3. **Image**: Se usa la primera imagen del array
4. **Quantity**: Se usa el inventario de la primera variante
5. **Description**: Se mantiene como HTML (puede parsearse después)

## Tipos Futuros (Planeados)

### CollectionType

```typescript
// Para implementar en el futuro
interface CollectionType {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string;
  productsCount: number;
}
```

### CartItemType

```typescript
// Para sistema de carrito
interface CartItemType {
  product: ProductType;
  variantId: string;
  quantity: number;
  selectedOptions: {
    [optionName: string]: string;
  };
}
```

### OrderType

```typescript
// Para órdenes/checkout
interface OrderType {
  id: string;
  items: CartItemType[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}
```

## Convenciones de Tipado

### 1. Interfaces vs Types

**Usar `interface` para:**
- Objetos que pueden extenderse
- Props de componentes
- Estructuras de datos de APIs

```typescript
interface ProductCardProps {
  product: ProductType;
  onAddToCart?: () => void;
}
```

**Usar `type` para:**
- Uniones de tipos
- Tipos primitivos complejos
- Aliases simples

```typescript
type ProductStatus = 'active' | 'draft' | 'archived'
type ID = string | number
```

### 2. Nomenclatura

- **Props de componentes:** `ComponentNameProps`
- **Tipos de datos:** `EntityType` o `EntityInterface`
- **Tipos de Shopify:** Prefijo `Shopify`
- **Enums/Unions:** Sin sufijo (ej: `ProductStatus`)

### 3. Nullability

Ser explícito con valores null/undefined:

```typescript
// ✅ Bueno
interface Product {
  id: string;
  title: string;
  description: string | null; // Puede ser null
  tags?: string;              // Opcional (puede ser undefined)
}

// ❌ Evitar
interface Product {
  id: string;
  title: string;
  description: any;           // Muy permisivo
}
```

### 4. Arrays

Preferir sintaxis de array explícita:

```typescript
// ✅ Bueno
variants: ShopifyProductVariant[]

// ❌ Menos claro
variants: Array<ShopifyProductVariant>
```

## Validación de Tipos

### Runtime Validation

Para datos de API externa, considerar validación runtime:

```typescript
// Ejemplo con zod (para implementar en el futuro)
import { z } from 'zod'

const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number().positive(),
  // ...
})

// Validar en tiempo de ejecución
const validateProduct = (data: unknown): ProductType => {
  return ProductSchema.parse(data)
}
```

## Testing de Tipos

### Mock Data

```typescript
// tests/mocks/products.ts
export const mockShopifyProduct: ShopifyProduct = {
  id: 123456,
  title: "Test Product",
  body_html: "<p>Description</p>",
  vendor: "Test Vendor",
  // ... resto de campos
}

export const mockProductType: ProductType = {
  id: "123456",
  title: "Test Product",
  description: "<p>Description</p>",
  price: 29.99,
  // ... resto de campos
}
```

## Referencias

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Shopify Admin API - Product Object](https://shopify.dev/docs/api/admin-rest/2023-07/resources/product)
- [Next.js TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)

---

**Autor:** Equipo de desarrollo
**Versión:** 1.0.0
**Última revisión:** 2025-12-10