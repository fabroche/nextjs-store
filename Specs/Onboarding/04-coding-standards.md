# Coding Standards

Esta guía define las convenciones y estándares de código que seguimos en el proyecto.

## Principios Generales

### 1. Simplicidad sobre Complejidad
Preferir soluciones simples y directas sobre abstracciones prematuras.

```tsx
// ❌ Evitar - Abstracción prematura
const formatPrice = (price: number, options?: PriceFormatterOptions) => {
  const formatter = new PriceFormatter(options)
  return formatter.format(price)
}

// ✅ Preferir - Simple y directo
const formatPrice = (price: number) => `$${price.toFixed(2)}`
```

### 2. Server Components por Defecto
Usar Server Components cuando sea posible. Solo usar Client Components cuando necesites interactividad.

```tsx
// ✅ Server Component (por defecto)
export default async function ProductsPage() {
  const products = await getProducts()
  return <div>{products.map(...)}</div>
}

// ✅ Client Component (solo cuando sea necesario)
"use client"
export function InteractiveCart() {
  const [items, setItems] = useState([])
  return <div>...</div>
}
```

### 3. TypeScript Estricto
Evitar `any` y tipar correctamente todas las funciones y componentes.

```tsx
// ❌ Evitar
function processData(data: any) {
  return data.items
}

// ✅ Preferir
interface ApiResponse {
  items: ProductType[]
}

function processData(data: ApiResponse): ProductType[] {
  return data.items
}
```

## TypeScript

### Convenciones de Tipos

**Interfaces vs Types:**
- Usar `interface` para props de componentes
- Usar `type` para tipos de datos/modelos

```tsx
// Props de componente - Interface
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

// Modelo de datos - Type
type ProductType = {
  id: string
  title: string
  price: number
}
```

### Naming de Tipos

```tsx
// Props de componentes: NombreComponenteProps
interface ProductCardProps { }

// Tipos de datos: NombreType
type UserType = { }

// Interfaces genéricas: INombre (solo cuando sea necesario)
interface IRepository<T> { }
```

### Props de Componentes

```tsx
interface ComponentProps {
  // Props requeridas primero
  title: string
  price: number

  // Props opcionales después
  description?: string
  variant?: 'primary' | 'secondary'

  // Children al final
  children?: React.ReactNode
}
```

### Funciones Tipadas

```tsx
// ✅ Tipar parámetros y retorno
function calculateTotal(
  items: ProductType[],
  tax: number
): number {
  return items.reduce((sum, item) => sum + item.price, 0) * (1 + tax)
}

// ✅ Arrow functions también
const formatDate = (date: Date): string => {
  return date.toLocaleDateString()
}
```

### Evitar Any

```tsx
// ❌ Nunca usar any
function handleData(data: any) { }

// ✅ Usar unknown y type guard
function handleData(data: unknown) {
  if (isValidData(data)) {
    // Ahora TypeScript sabe el tipo
    return data.items
  }
}

function isValidData(data: unknown): data is { items: string[] } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'items' in data
  )
}
```

## SASS y CSS Modules

### Convención BEM

**Block Element Modifier:**

```sass
.ComponentName           // Block
  // Estilos del bloque

  &__element            // Element
    // Estilos del elemento

  &--modifier           // Modifier
    // Variante del bloque

  &__element--modifier  // Element modifier
    // Variante del elemento
```

### Ejemplo Real

```sass
.ProductCard
  display: flex
  flex-direction: column
  border: 1px solid $border-color

  &__image
    width: 100%
    height: 300px
    object-fit: cover

  &__title
    font-size: 1.5rem
    font-weight: 700

  &__price
    color: $main-contrast
    font-size: 1.25rem

  &--featured
    border: 2px solid $main-contrast
    box-shadow: 0 4px 8px rgba(0,0,0,0.2)

  &__image--rounded
    border-radius: 8px
```

### Uso en Componentes

```tsx
import styles from './ProductCard.module.sass'

export function ProductCard({ featured, roundedImage }) {
  return (
    <div className={`
      ${styles.ProductCard}
      ${featured ? styles['ProductCard--featured'] : ''}
    `}>
      <img
        className={`
          ${styles.ProductCard__image}
          ${roundedImage ? styles['ProductCard__image--rounded'] : ''}
        `}
      />
      <h3 className={styles.ProductCard__title}>Title</h3>
      <p className={styles.ProductCard__price}>$99</p>
    </div>
  )
}
```

### Variables y Mixins

**Usar variables del sistema:**

```sass
// ✅ Usar variables definidas
.MyComponent
  background-color: $color-primary
  color: $text-color
  border-color: $border-color

// ❌ Evitar hard-coded colors
.MyComponent
  background-color: #13111a
  color: #fff
```

**Variables disponibles:**
```sass
// Colores
$color-primary: #13111a
$color-secondary: #e4e1f6
$border-color: #302c3f
$text-color: #fff
$main-contrast: #ff4980

// Gradiente
$gradient: linear-gradient(270deg, #4f56ff, #ff4980)
```

### Organización de Estilos

```sass
.Component
  // 1. Positioning
  position: relative
  top: 0
  left: 0

  // 2. Box model
  display: flex
  width: 100%
  padding: 1rem
  margin: 0

  // 3. Typography
  font-size: 1rem
  font-weight: 400
  color: $text-color

  // 4. Visual
  background-color: $color-primary
  border: 1px solid $border-color
  border-radius: 8px

  // 5. Misc
  cursor: pointer
  transition: all 0.3s ease

  // 6. Elements y modifiers
  &__element
    // ...

  &--modifier
    // ...
```

## Componentes React

### Estructura de Archivo

```tsx
// 1. Imports de bibliotecas
import { useState } from 'react'
import Link from 'next/link'

// 2. Imports de componentes
import { Button } from '@/components/shared/Button'

// 3. Imports de servicios/utils
import { formatPrice } from '@/utils/formatters'

// 4. Imports de tipos
import type { ProductType } from '@/types'

// 5. Imports de estilos
import styles from './ComponentName.module.sass'

// 6. Definición de tipos/interfaces
interface ComponentNameProps {
  // ...
}

// 7. Componente
export const ComponentName = ({ ...props }: ComponentNameProps) => {
  // Hooks
  const [state, setState] = useState()

  // Handlers
  const handleClick = () => {
    // ...
  }

  // Render
  return (
    <div className={styles.ComponentName}>
      {/* JSX */}
    </div>
  )
}
```

### Naming Conventions

**Componentes:**
```tsx
// PascalCase para componentes
export const ProductCard = () => { }
export const MainNavigation = () => { }
```

**Funciones y variables:**
```tsx
// camelCase para funciones y variables
const handleSubmit = () => { }
const isLoading = false
const productList = []
```

**Constantes:**
```tsx
// UPPER_SNAKE_CASE para constantes
const MAX_ITEMS = 100
const API_ENDPOINT = '/api/products'
```

**Archivos:**
```
ComponentName.tsx           // PascalCase para componentes
ComponentName.module.sass   // PascalCase + .module.sass
index.ts                    // Barrel exports
utils.ts                    // camelCase para utilities
```

### Barrel Exports

**Siempre usar barrel exports:**

```ts
// ✅ index.ts
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName'

// ❌ No exportar directamente
import { ComponentName } from '@/components/shared/Button/Button'

// ✅ Usar barrel export
import { Button } from '@/components/shared/Button'
```

### Destructuring de Props

```tsx
// ✅ Destructurar en la firma
export const ProductCard = ({
  title,
  price,
  image,
  onAddToCart,
}: ProductCardProps) => {
  return <div>{title}</div>
}

// ❌ Evitar usar props.
export const ProductCard = (props: ProductCardProps) => {
  return <div>{props.title}</div>
}
```

### Conditional Rendering

```tsx
// ✅ Simple condition
{isLoading && <Loader />}

// ✅ Ternario para dos casos
{isLoggedIn ? <Dashboard /> : <Login />}

// ✅ Early return para casos complejos
if (isLoading) return <Loader />
if (error) return <Error message={error} />
return <Content data={data} />
```

## Manejo de Errores

### Try-Catch en Servicios

```tsx
// ✅ Siempre usar try-catch en servicios
export const getProducts = async (): Promise<ProductType[]> => {
  try {
    const response = await fetch(shopifyUrls.products, {
      headers: {
        'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const data = await response.json()
    return data.products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []  // Retornar valor por defecto
  }
}
```

### Error Boundaries

```tsx
// ✅ Usar error boundaries en rutas
// app/productos/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Error: {error.message}</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Performance

### Imágenes

```tsx
// ✅ Siempre usar next/image
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

// ❌ Evitar <img> nativo
<img src={product.image} alt={product.title} />
```

### Fetch de Datos

```tsx
// ✅ Server Component - fetch directo
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductList products={products} />
}

// ✅ Client Component - usar SWR o React Query (futuro)
"use client"
export function ProductsClient() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
  }, [])

  return <ProductList products={products} />
}
```

## Comentarios y Documentación

### Cuándo Comentar

```tsx
// ✅ Comentar lógica compleja
// Calculate discount based on quantity tiers:
// 1-10 items: 0%, 11-50: 10%, 51+: 20%
const getDiscount = (quantity: number) => {
  if (quantity <= 10) return 0
  if (quantity <= 50) return 0.1
  return 0.2
}

// ❌ No comentar lo obvio
// Set the state to true
setState(true)
```

### JSDoc para Funciones Públicas

```tsx
/**
 * Formats a price value to currency string
 * @param price - The numeric price value
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted price string
 *
 * @example
 * formatPrice(99.99, 'USD') // "$99.99"
 */
export function formatPrice(
  price: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price)
}
```

## Buenas Prácticas

### ✅ DO

- Usar Server Components por defecto
- Tipar todo con TypeScript
- Usar barrel exports
- Seguir convención BEM en SASS
- Usar variables del sistema de diseño
- Hacer componentes pequeños (< 200 líneas)
- Usar try-catch en servicios
- Optimizar imágenes con next/image
- Escribir commits descriptivos

### ❌ DON'T

- Usar `any` en TypeScript
- Hard-codear colores en estilos
- Crear componentes monolíticos
- Usar `<img>` en vez de `next/image`
- Duplicar lógica en múltiples lugares
- Commitear archivos `.env`
- Ignorar errores de TypeScript
- Usar estilos inline

---

**Anterior:** [← Development Workflow](./03-development-workflow.md)
**Siguiente:** [Shopify Integration →](./05-shopify-integration.md)
