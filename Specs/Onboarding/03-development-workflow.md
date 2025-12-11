# Development Workflow

Esta guía te enseñará cómo realizar las tareas más comunes en el desarrollo diario del proyecto.

## Flujo de Trabajo Diario

```
1. Pull últimos cambios
   ↓
2. Crear branch para tu feature
   ↓
3. Desarrollar (componentes/páginas/servicios)
   ↓
4. Probar localmente
   ↓
5. Commit y push
   ↓
6. Crear Pull Request
```

## Crear un Componente

### Paso 1: Decidir la Ubicación

```
src/components/
├── shared/        # Componentes reutilizables en toda la app
├── home/          # Componentes específicos de la home
└── Store/         # Componentes específicos de la tienda
```

### Paso 2: Crear la Estructura

**Ejemplo: Crear un botón genérico**

```bash
# Crear carpeta del componente
mkdir src/components/shared/Button

# Crear archivos
touch src/components/shared/Button/Button.tsx
touch src/components/shared/Button/Button.module.sass
touch src/components/shared/Button/index.ts
```

### Paso 3: Implementar el Componente

**Button/Button.tsx:**
```tsx
import styles from './Button.module.sass'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) => {
  return (
    <button
      className={`${styles.Button} ${styles[`Button--${variant}`]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

### Paso 4: Crear los Estilos

**Button/Button.module.sass:**
```sass
.Button
  padding: 1rem 2rem
  border: none
  border-radius: 8px
  font-size: 1rem
  cursor: pointer
  transition: all 0.3s ease

  &--primary
    background-image: $gradient
    color: $text-color

  &--secondary
    background-color: $color-secondary
    color: $color-primary

  &:disabled
    opacity: 0.5
    cursor: not-allowed
```

### Paso 5: Crear el Barrel Export

**Button/index.ts:**
```ts
export { Button } from './Button'
```

### Paso 6: Usar el Componente

```tsx
import { Button } from '@/components/shared/Button'

function MyPage() {
  return (
    <div>
      <Button variant="primary" onClick={() => console.log('Click!')}>
        Click Me
      </Button>
    </div>
  )
}
```

## Crear una Página

### Paso 1: Entender el Routing

```
src/app/
├── about/
│   └── page.tsx        → /about
├── blog/
│   ├── page.tsx        → /blog
│   └── [slug]/
│       └── page.tsx    → /blog/mi-post
└── products/
    └── [id]/
        └── page.tsx    → /products/123
```

### Paso 2: Crear la Carpeta y Archivo

**Ejemplo: Crear página "About"**

```bash
mkdir src/app/about
touch src/app/about/page.tsx
```

### Paso 3: Implementar la Página

**Server Component (sin "use client"):**
```tsx
// src/app/about/page.tsx
import { Metadata } from 'next'

// Metadata para SEO
export const metadata: Metadata = {
  title: 'About Us - Next.js Store',
  description: 'Learn more about our store',
}

// Página como Server Component (puede ser async)
export default async function AboutPage() {
  // Puedes hacer fetch directamente en server components
  const data = await fetch('...').then(r => r.json())

  return (
    <main>
      <h1>About Us</h1>
      <p>Welcome to our store!</p>
    </main>
  )
}
```

**Client Component (con interactividad):**
```tsx
// src/app/contact/page.tsx
"use client"  // Necesario para usar hooks

import { useState } from 'react'

export default function ContactPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email:', email)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Paso 4: Agregar Layout (Opcional)

**src/app/about/layout.tsx:**
```tsx
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="about-section">
      <nav>{/* Navegación específica de About */}</nav>
      {children}
    </div>
  )
}
```

### Paso 5: Agregar Loading y Error States

**src/app/about/loading.tsx:**
```tsx
import { Loader } from '@/components/shared/Loader'

export default function Loading() {
  return <Loader />
}
```

**src/app/about/error.tsx:**
```tsx
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
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## Crear una API Route

### Paso 1: Crear el Archivo

Las API Routes viven en `src/app/api/`

```bash
mkdir -p src/app/api/newsletter
touch src/app/api/newsletter/route.ts
```

### Paso 2: Implementar el Handler

**src/app/api/newsletter/route.ts:**
```tsx
import { NextResponse } from 'next/server'

// GET /api/newsletter
export async function GET(request: Request) {
  try {
    // Lógica aquí
    const data = { message: 'Newsletter API' }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// POST /api/newsletter
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Validación
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Lógica de guardar email...

    return NextResponse.json(
      { message: 'Subscribed successfully' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

### Paso 3: Consumir desde el Frontend

```tsx
"use client"

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Subscribed!')
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('Error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button disabled={loading}>
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
    </form>
  )
}
```

## Integrar un Servicio de Shopify

### Paso 1: Crear el Servicio

**src/services/shopify/customers.ts:**
```ts
import { env } from '@/config/env'
import { shopifyUrls } from './urls'

export const getCustomers = async () => {
  try {
    const response = await fetch(shopifyUrls.customers, {
      headers: {
        'X-Shopify-Access-Token': env.SHOPIFY_API_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch customers')
    }

    const { customers } = await response.json()
    return customers
  } catch (error) {
    console.error('Error fetching customers:', error)
    return []
  }
}
```

### Paso 2: Agregar URL

**src/services/shopify/urls.ts:**
```ts
import { env } from '@/config/env'

const SHOPIFY_BASE_URL = `https://${env.SHOPIFY_HOSTNAME}/admin/api/2023-07`

export const shopifyUrls = {
  products: `${SHOPIFY_BASE_URL}/products.json`,
  collections: `${SHOPIFY_BASE_URL}/smart_collections.json`,
  customers: `${SHOPIFY_BASE_URL}/customers.json`,  // Nueva
}
```

### Paso 3: Exportar

**src/services/shopify/index.ts:**
```ts
export { getProducts } from './products'
export { getCollections } from './collections'
export { getCustomers } from './customers'  // Nueva
```

### Paso 4: Usar en Componentes

```tsx
import { getCustomers } from '@/services/shopify'

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div>
      {customers.map(customer => (
        <div key={customer.id}>{customer.name}</div>
      ))}
    </div>
  )
}
```

## Trabajar con Estilos

### SASS Variables

Las variables están disponibles globalmente:

```sass
// Usar variables del sistema
.MyComponent
  background-color: $color-primary
  color: $text-color
  border: 1px solid $border-color

  &__title
    background-image: $gradient
    background-clip: text
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent
```

### Uso con classnames

```tsx
import styles from './Card.module.sass'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export function Card({ isActive, variant }) {
  const classes = cx('Card', {
    'Card--active': isActive,
    'Card--highlighted': variant === 'highlight',
  })

  return <div className={classes}>...</div>
}
```

## Testing Local

### Verificar Cambios

```bash
# Modo desarrollo con hot reload
npm run dev

# Verificar en navegador
# http://localhost:3000
```

### Build de Producción

```bash
# Compilar para producción
npm run build

# Si hay errores, resolverlos antes de commit

# Ejecutar build localmente
npm start
```

### Linting

```bash
# Ejecutar linter
npm run lint

# Auto-fix problemas simples
npm run lint --fix
```

## Git Workflow

### Crear Branch

```bash
# Actualizar main
git checkout main
git pull origin main

# Crear branch para tu feature
git checkout -b feature/nombre-descriptivo
```

### Commits

```bash
# Ver cambios
git status
git diff

# Agregar archivos
git add src/components/shared/Button/

# Commit con mensaje descriptivo
git commit -m "feat: add reusable Button component"
```

**Convención de commits:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `refactor:` Refactorización
- `style:` Cambios de estilos
- `docs:` Documentación
- `test:` Tests

### Push y PR

```bash
# Push a tu branch
git push origin feature/nombre-descriptivo

# Crear Pull Request en GitHub/GitLab
# Solicitar review del equipo
```

---

**Anterior:** [← Project Overview](./02-project-overview.md)
**Siguiente:** [Coding Standards →](./04-coding-standards.md)
