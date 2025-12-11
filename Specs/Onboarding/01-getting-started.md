# Getting Started

Esta guía te ayudará a configurar el proyecto en tu entorno local.

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.x o superior
- **npm** 9.x o superior
- **Git**
- Un editor de código (recomendado: VS Code, WebStorm)

## Paso 1: Clonar el Repositorio

```bash
git clone <repository-url>
cd nextjs-store
```

## Paso 2: Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias:
- Next.js 15.5.2
- React 19.1.0
- TypeScript 5.x
- SASS 1.92.1
- classnames 2.5.1

## Paso 3: Configurar Variables de Entorno

### Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Windows
copy .env.example .env.local

# macOS/Linux
cp .env.example .env.local
```

### Configurar Shopify

Edita el archivo `.env.local` con tus credenciales de Shopify:

```bash
SHOPIFY_HOSTNAME="tu-tienda.myshopify.com"
SHOPIFY_API_KEY="shpat_xxxxxxxxxxxxxxxxxxxxx"
```

#### Cómo obtener las credenciales:

1. Accede a tu **Shopify Admin Panel**
2. Ve a **Settings** > **Apps and sales channels**
3. Crea una **Custom App** o usa una existente
4. Copia el **API Access Token** como `SHOPIFY_API_KEY`
5. El hostname es tu dominio de Shopify (ej: `tienda.myshopify.com`)

### Variables de Entorno Disponibles

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `SHOPIFY_HOSTNAME` | Dominio de tu tienda Shopify | Sí |
| `SHOPIFY_API_KEY` | Token de acceso a Shopify Admin API | Sí |

## Paso 4: Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo en [http://localhost:3000](http://localhost:3000)

### Verificar que Todo Funciona

1. Abre tu navegador en `http://localhost:3000`
2. Deberías ver la página principal con productos de Shopify
3. Navega a `/store` para ver el catálogo completo

## Comandos Disponibles

```bash
# Desarrollo local con hot reload
npm run dev

# Build de producción
npm run build

# Ejecutar build de producción
npm start

# Linting del código
npm run lint

# Generar componente boilerplate
npm run generate:componentes-boilerplate
```

## Estructura Inicial

Una vez configurado, deberías tener esta estructura:

```
nextjs-store/
├── .env.local          # Variables de entorno (no versionado)
├── .env.example        # Template de variables de entorno
├── node_modules/       # Dependencias instaladas
├── public/             # Archivos estáticos
├── src/                # Código fuente
├── package.json        # Dependencias y scripts
└── next.config.ts      # Configuración de Next.js
```

## Verificar la Instalación

Ejecuta estos comandos para verificar que todo está correctamente configurado:

```bash
# Verificar versión de Node
node --version
# Debe ser >= 18.x

# Verificar versión de npm
npm --version
# Debe ser >= 9.x

# Verificar que las dependencias están instaladas
npm list --depth=0

# Verificar que el proyecto compila sin errores
npm run build
```

## Problemas Comunes de Instalación

### Error: "Cannot find module '@/...'"

**Solución:**
1. Verifica que `tsconfig.json` tenga configurado el path alias
2. Reinicia el servidor de desarrollo
3. Reinicia tu IDE

### Error: "SHOPIFY_HOSTNAME is not defined"

**Solución:**
1. Asegúrate de que `.env.local` existe en la raíz del proyecto
2. Verifica que las variables estén escritas correctamente
3. Reinicia el servidor de desarrollo

### Error al instalar dependencias

**Solución:**
```bash
# Limpia caché de npm
npm cache clean --force

# Elimina node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstala dependencias
npm install
```

## Siguientes Pasos

Una vez que tengas el proyecto corriendo:

1. Lee [Project Overview](./02-project-overview.md) para entender la arquitectura
2. Revisa [Development Workflow](./03-development-workflow.md) para empezar a desarrollar
3. Familiarízate con [Coding Standards](./04-coding-standards.md)

## Recursos Adicionales

- **Documentación de Next.js:** https://nextjs.org/docs
- **Shopify API Docs:** https://shopify.dev/docs/api/admin-rest
- **Guía de TypeScript:** https://www.typescriptlang.org/docs/

---

**Siguiente:** [Project Overview →](./02-project-overview.md)
