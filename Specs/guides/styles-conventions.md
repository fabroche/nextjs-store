# Guía de Estilos y Convenciones

> Convenciones de estilos SASS, CSS Modules y mejores prácticas
> Última actualización: 2025-12-10

## Contexto

Este documento establece las convenciones de estilos del proyecto, incluyendo metodología BEM, uso de SASS, CSS Modules, variables de diseño y mejores prácticas para mantener consistencia en el código CSS.

## Stack de Estilos

- **Preprocesador:** SASS 1.92.1
- **Metodología:** BEM (Block Element Modifier)
- **Scope:** CSS Modules
- **Utilidades:** classnames 2.5.1

## CSS Modules

### Nomenclatura de Archivos

Todos los archivos de estilos de componentes deben seguir este patrón:

```
ComponentName.module.sass
```

**Ejemplos:**
- `Header.module.sass`
- `ProductCard.module.sass`
- `MainProducts.module.sass`

### Importación

```typescript
// ComponentName.tsx
import styles from './ComponentName.module.sass'

export const ComponentName = () => {
  return <div className={styles.ComponentName}>...</div>
}
```

### Ventajas de CSS Modules

1. **Scope local:** Evita colisiones de nombres
2. **Type-safety:** TypeScript autocomplete para clases
3. **Tree-shaking:** Solo incluye estilos utilizados
4. **Mantenibilidad:** Estilos junto al componente

## Metodología BEM

### Estructura BEM

```
Block__Element--Modifier
```

**Componentes:**
- **Block:** Entidad independiente (ej: `ProductCard`)
- **Element:** Parte del bloque (ej: `ProductCard__title`)
- **Modifier:** Variante del bloque o elemento (ej: `ProductCard--featured`)

### Implementación en SASS

```sass
.ComponentName
  // Estilos del bloque principal
  display: flex
  padding: 1rem

  &__element
    // Estilos del elemento
    font-size: 1rem
    color: $text-color

  &__anotherElement
    // Otro elemento
    margin-top: 0.5rem

  &--modifier
    // Modificador del bloque
    background: $main-contrast

  &__element--modifier
    // Modificador de un elemento
    font-weight: bold
```

**Resultado compilado:**
```css
.ComponentName { ... }
.ComponentName__element { ... }
.ComponentName__anotherElement { ... }
.ComponentName--modifier { ... }
.ComponentName__element--modifier { ... }
```

### Ejemplo Real: ProductCard

```sass
// ProductCard.module.sass
.ProductCard
  background: $color-primary
  border: 1px solid $border-color
  border-radius: 8px
  padding: 1.5rem
  transition: transform 0.2s

  &:hover
    transform: translateY(-4px)

  &__image
    width: 100%
    height: 320px
    object-fit: cover
    border-radius: 4px

  &__info
    margin-top: 1rem

  &__title
    font-size: 1.25rem
    font-weight: 700
    color: $text-color
    margin-bottom: 0.5rem

  &__description
    font-size: 0.875rem
    color: $color-secondary
    line-height: 1.5

  &__priceTag
    display: flex
    align-items: center
    gap: 0.5rem
    margin-top: 1rem

  &__price
    font-size: 1.5rem
    font-weight: 700
    background-image: $gradient
    background-clip: text
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent

  &__comparePrice
    font-size: 1rem
    color: $color-secondary
    text-decoration: line-through

  &__link
    display: block
    text-decoration: none
    color: inherit

  &--featured
    border: 2px solid $main-contrast
    box-shadow: 0 4px 12px rgba(255, 73, 128, 0.3)

  &--outOfStock
    opacity: 0.6
    pointer-events: none

    .ProductCard__price
      color: $color-secondary
```

**Uso en componente:**

```typescript
import styles from './ProductCard.module.sass'

interface ProductCardProps {
  product: ProductType;
  featured?: boolean;
  outOfStock?: boolean;
}

export const ProductCard = ({
  product,
  featured,
  outOfStock
}: ProductCardProps) => {
  const cardClass = [
    styles.ProductCard,
    featured && styles['ProductCard--featured'],
    outOfStock && styles['ProductCard--outOfStock']
  ].filter(Boolean).join(' ')

  return (
    <article className={cardClass}>
      <img
        className={styles.ProductCard__image}
        src={product.image}
        alt={product.title}
      />
      <div className={styles.ProductCard__info}>
        <h3 className={styles.ProductCard__title}>{product.title}</h3>
        <div className={styles.ProductCard__priceTag}>
          <span className={styles.ProductCard__price}>${product.price}</span>
        </div>
      </div>
    </article>
  )
}
```

## Librería classnames

### Instalación y Uso

```bash
npm install classnames
```

### Uso Básico

```typescript
import classNames from 'classnames'

const buttonClass = classNames({
  'Button': true,
  'Button--primary': isPrimary,
  'Button--disabled': isDisabled
})
```

### Con CSS Modules (bind)

```typescript
import classNames from 'classnames/bind'
import styles from './Button.module.sass'

const cx = classNames.bind(styles)

export const Button = ({ primary, disabled, children }) => {
  const buttonClass = cx('Button', {
    'Button--primary': primary,
    'Button--disabled': disabled
  })

  return <button className={buttonClass}>{children}</button>
}
```

**Ventajas:**
- Sintaxis limpia para clases condicionales
- Elimina `undefined` y `false` automáticamente
- Type-safety con bind

### Ejemplo Completo

```typescript
import classNames from 'classnames/bind'
import styles from './ProductCard.module.sass'

const cx = classNames.bind(styles)

export const ProductCard = ({
  product,
  featured = false,
  size = 'medium'
}) => {
  const cardClass = cx('ProductCard', {
    'ProductCard--featured': featured,
    'ProductCard--large': size === 'large',
    'ProductCard--small': size === 'small',
    'ProductCard--outOfStock': product.quantity === 0
  })

  const priceClass = cx('ProductCard__price', {
    'ProductCard__price--discounted': product.comparePrice
  })

  return (
    <article className={cardClass}>
      <span className={priceClass}>${product.price}</span>
    </article>
  )
}
```

## Variables de Diseño

### Archivo Principal

**Ubicación:** `src/sass/_variables.sass`

```sass
// ========================================
// Colores
// ========================================

// Colores principales
$color-primary: #13111a        // Fondo oscuro principal
$color-secondary: #e4e1f6      // Secundario claro
$border-color: #302c3f         // Bordes oscuros
$text-color: #fff              // Texto blanco
$main-contrast: #ff4980        // Rosa principal (contraste)

// Colores semánticos
$color-success: #4ade80
$color-warning: #fbbf24
$color-error: #ef4444
$color-info: #3b82f6

// Gradientes
$gradient: linear-gradient(270deg, #4f56ff, #ff4980)
$gradient-vertical: linear-gradient(180deg, #4f56ff, #ff4980)

// ========================================
// Tipografía
// ========================================

// Tamaños de fuente
$font-xs: 0.75rem      // 12px
$font-sm: 0.875rem     // 14px
$font-base: 1rem       // 16px
$font-lg: 1.125rem     // 18px
$font-xl: 1.25rem      // 20px
$font-2xl: 1.5rem      // 24px
$font-3xl: 1.875rem    // 30px
$font-4xl: 2.25rem     // 36px

// Pesos de fuente
$font-normal: 400
$font-bold: 700

// Line heights
$leading-tight: 1.25
$leading-normal: 1.5
$leading-relaxed: 1.75

// ========================================
// Espaciado
// ========================================

$spacing-xs: 0.25rem   // 4px
$spacing-sm: 0.5rem    // 8px
$spacing-md: 1rem      // 16px
$spacing-lg: 1.5rem    // 24px
$spacing-xl: 2rem      // 32px
$spacing-2xl: 3rem     // 48px
$spacing-3xl: 4rem     // 64px

// ========================================
// Layout
// ========================================

// Contenedores
$container-sm: 640px
$container-md: 768px
$container-lg: 1024px
$container-xl: 1280px
$container-2xl: 1536px

// Breakpoints
$breakpoint-sm: 640px
$breakpoint-md: 768px
$breakpoint-lg: 1024px
$breakpoint-xl: 1280px
$breakpoint-2xl: 1536px

// ========================================
// Borders
// ========================================

$border-radius-sm: 4px
$border-radius-md: 8px
$border-radius-lg: 12px
$border-radius-xl: 16px
$border-radius-full: 9999px

$border-width: 1px
$border-width-thick: 2px

// ========================================
// Shadows
// ========================================

$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)

// ========================================
// Transiciones
// ========================================

$transition-fast: 150ms ease-in-out
$transition-base: 250ms ease-in-out
$transition-slow: 350ms ease-in-out

// ========================================
// Z-index
// ========================================

$z-dropdown: 1000
$z-sticky: 1020
$z-fixed: 1030
$z-modal-backdrop: 1040
$z-modal: 1050
$z-popover: 1060
$z-tooltip: 1070
```

### Uso de Variables

```sass
.Component
  background: $color-primary
  padding: $spacing-lg
  border-radius: $border-radius-md
  transition: transform $transition-base

  &:hover
    box-shadow: $shadow-lg
```

## Estilos Globales

### Configuración de SASS

**Archivo:** `next.config.ts`

```typescript
import path from 'path'

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/sass')],
    prependData: `@import "main.sass"`
  }
}
```

**Ventaja:** Variables disponibles en todos los archivos `.module.sass` sin importarlas manualmente.

### Archivo Main

**Ubicación:** `src/sass/main.sass`

```sass
// Importar variables (disponibles globalmente)
@import variables

// Importar mixins y funciones
@import mixins
@import functions

// No importar estilos de componentes aquí
// Solo variables, mixins y utilidades
```

### Estilos Globales

**Ubicación:** `src/sass/globals.sass`

```sass
// Reset y estilos base
*,
*::before,
*::after
  box-sizing: border-box
  margin: 0
  padding: 0

html,
body
  height: 100%
  font-family: 'Roboto', sans-serif
  background: $color-primary
  color: $text-color
  line-height: $leading-normal

a
  color: inherit
  text-decoration: none

button
  font-family: inherit
  cursor: pointer

// Utilidades globales
.container
  max-width: $container-xl
  margin: 0 auto
  padding: 0 $spacing-lg

.gradient-text
  background-image: $gradient
  background-clip: text
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
```

## Patrones de Diseño

### Gradientes en Texto

```sass
.GradientText
  background-image: $gradient
  background-clip: text
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
  display: inline-block // Importante para que funcione correctamente
```

### Cards

```sass
.Card
  background: $color-primary
  border: $border-width solid $border-color
  border-radius: $border-radius-lg
  padding: $spacing-lg
  transition: transform $transition-base, box-shadow $transition-base

  &:hover
    transform: translateY(-4px)
    box-shadow: $shadow-xl
```

### Grids Responsivos

```sass
.ProductGrid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))
  gap: $spacing-xl
  justify-content: center

  @media (max-width: $breakpoint-md)
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
    gap: $spacing-lg

  @media (max-width: $breakpoint-sm)
    grid-template-columns: 1fr
    gap: $spacing-md
```

### Buttons

```sass
.Button
  display: inline-flex
  align-items: center
  justify-content: center
  gap: $spacing-sm
  padding: $spacing-md $spacing-lg
  border: none
  border-radius: $border-radius-md
  font-weight: $font-bold
  transition: all $transition-base
  cursor: pointer

  &:hover
    transform: translateY(-2px)
    box-shadow: $shadow-md

  &:active
    transform: translateY(0)

  &--primary
    background-image: $gradient
    color: $text-color

  &--secondary
    background: transparent
    border: $border-width-thick solid $main-contrast
    color: $main-contrast

  &--disabled
    opacity: 0.5
    cursor: not-allowed
    pointer-events: none
```

## Responsive Design

### Mobile-First Approach

```sass
// Base (móvil)
.Component
  padding: $spacing-md

  // Tablet y superior
  @media (min-width: $breakpoint-md)
    padding: $spacing-lg

  // Desktop y superior
  @media (min-width: $breakpoint-lg)
    padding: $spacing-xl
```

### Breakpoint Mixins (Futuro)

```sass
// _mixins.sass
@mixin sm
  @media (min-width: $breakpoint-sm)
    @content

@mixin md
  @media (min-width: $breakpoint-md)
    @content

@mixin lg
  @media (min-width: $breakpoint-lg)
    @content

// Uso
.Component
  padding: $spacing-md

  +md
    padding: $spacing-lg

  +lg
    padding: $spacing-xl
```

## Mejores Prácticas

### 1. Nombres Descriptivos

```sass
// ✅ Bueno
.ProductCard__priceTag
.Hero__callToAction
.Header__navigationMenu

// ❌ Evitar
.ProductCard__price1
.Hero__cta
.Header__nav
```

### 2. Evitar Anidamiento Profundo

```sass
// ✅ Bueno (máximo 3 niveles)
.ProductCard
  &__info
    &__title
      font-size: $font-xl

// ❌ Evitar (demasiado anidado)
.ProductCard
  &__wrapper
    &__container
      &__info
        &__title
          font-size: $font-xl
```

### 3. Consistencia en Unidades

```sass
// ✅ Bueno (usar rem para espaciado)
padding: $spacing-lg // 1.5rem
margin-bottom: $spacing-md // 1rem

// ❌ Evitar (mezclar unidades sin razón)
padding: 24px
margin-bottom: 1rem
```

### 4. Variables sobre Valores Hardcodeados

```sass
// ✅ Bueno
background: $color-primary
padding: $spacing-lg
border-radius: $border-radius-md

// ❌ Evitar
background: #13111a
padding: 24px
border-radius: 8px
```

### 5. Transiciones Consistentes

```sass
// ✅ Bueno
transition: transform $transition-base

// ❌ Evitar
transition: transform 250ms ease-in-out // usar variable
```

## Convenciones de Nombres

### Archivos SASS

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Módulos de componentes | PascalCase.module.sass | `Header.module.sass` |
| Estilos globales | kebab-case.sass | `global-error.module.sass` |
| Variables/mixins | _nombre.sass (con guión bajo) | `_variables.sass` |

### Clases CSS

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Bloques | PascalCase | `.ProductCard` |
| Elementos | PascalCase__camelCase | `.ProductCard__priceTag` |
| Modificadores | PascalCase--camelCase | `.ProductCard--featured` |

## Performance

### 1. Evitar Selectores Complejos

```sass
// ✅ Bueno
.ProductCard__title
  color: $text-color

// ❌ Evitar
.ProductCard .info .title
  color: $text-color
```

### 2. Usar will-change con Moderación

```sass
// Solo cuando sepas que va a animar
.ProductCard
  will-change: transform

  &:hover
    transform: translateY(-4px)
```

### 3. Optimizar Animaciones

```sass
// ✅ Bueno (animar transform y opacity)
.Card
  transition: transform $transition-base, opacity $transition-base

// ❌ Evitar (animar propiedades que causan reflow)
.Card
  transition: width $transition-base, height $transition-base
```

## Referencias

- [BEM Methodology](https://getbem.com/)
- [SASS Documentation](https://sass-lang.com/documentation/)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [Next.js CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules)

---

**Autor:** Equipo de desarrollo
**Versión:** 1.0.0
**Última revisión:** 2025-12-10