# Especificaciones Técnicas - Next.js Shopify Store

> Documentación técnica y arquitectónica del proyecto
> Última actualización: 2025-12-10

## Propósito

Esta carpeta contiene toda la documentación técnica, especificaciones y análisis del proyecto. Sirve como memoria de desarrollo y referencia para decisiones arquitectónicas, tipos de datos, integraciones y planes de implementación.

## Estructura de Carpetas

```
Specs/
├── architecture/           # Arquitectura y estructura del proyecto
│   ├── project-structure.md
│   └── component-patterns.md
│
├── types/                  # Documentación de tipos TypeScript
│   └── type-definitions.md
│
├── api-integration/        # Integraciones con APIs externas
│   └── shopify-integration.md
│
├── implementation-plans/   # Planes de implementación de features
│   └── [feature-name].md
│
├── technical-analysis/     # Análisis técnicos y decisiones
│   └── [analysis-name].md
│
└── guides/                 # Guías de desarrollo y convenciones
    └── styles-conventions.md
```

## Tipos de Documentos

### 1. Architecture (Arquitectura)
Documentos que describen la arquitectura general del proyecto, patrones de diseño, estructura de carpetas y organización del código.

**Cuándo crear:**
- Al definir la estructura inicial del proyecto
- Al implementar nuevos patrones arquitectónicos
- Al reorganizar la estructura del proyecto

### 2. Types (Tipos)
Documentación detallada de tipos TypeScript, interfaces y estructuras de datos utilizadas en el proyecto.

**Cuándo crear:**
- Al definir nuevos tipos complejos
- Al integrar nuevas APIs que requieren tipado
- Al refactorizar tipos existentes

### 3. API Integration (Integración de APIs)
Especificaciones de integraciones con servicios externos, endpoints, autenticación y manejo de datos.

**Cuándo crear:**
- Al integrar un nuevo servicio externo
- Al documentar endpoints de API
- Al cambiar versiones de API

### 4. Implementation Plans (Planes de Implementación)
Planes detallados para implementar nuevas funcionalidades, incluyendo pasos, dependencias y consideraciones técnicas.

**Cuándo crear:**
- Antes de implementar features complejas
- Al planificar refactorizaciones mayores
- Al necesitar aprobación de arquitectura

### 5. Technical Analysis (Análisis Técnicos)
Análisis de problemas técnicos, comparaciones de tecnologías, decisiones arquitectónicas y sus justificaciones.

**Cuándo crear:**
- Al evaluar diferentes soluciones técnicas
- Al documentar decisiones importantes
- Al analizar problemas de rendimiento

### 6. Guides (Guías)
Guías de desarrollo, convenciones de código, mejores prácticas y estándares del proyecto.

**Cuándo crear:**
- Al establecer convenciones de equipo
- Al documentar mejores prácticas
- Al crear guías de estilo

## Formato de Documentos

Todos los documentos deben seguir este formato base:

```markdown
# Título del Documento

> Breve descripción
> Última actualización: YYYY-MM-DD

## Contexto
[Contexto y motivación del documento]

## [Secciones específicas según el tipo]

## Referencias
- Enlaces a recursos relacionados
- Documentación externa
- Issues o PRs relacionados

---

**Autor:** [Nombre]
**Versión:** X.Y.Z
```

## Convenciones

1. **Nombres de archivos:** kebab-case (ejemplo: `shopify-integration.md`)
2. **Títulos:** Title Case para secciones principales
3. **Código:** Usar bloques de código con lenguaje especificado
4. **Diagramas:** Usar ASCII art o mermaid cuando sea posible
5. **Fechas:** Formato ISO (YYYY-MM-DD)
6. **Versionado:** Semantic versioning (X.Y.Z)

## Actualización de Documentos

Los documentos deben actualizarse:
- Al implementar cambios que afecten la arquitectura
- Al agregar/modificar tipos
- Al cambiar integraciones con APIs
- Al completar planes de implementación

Siempre actualizar:
1. Fecha de última actualización
2. Número de versión (si aplica)
3. Sección de changelog (si existe)

## Uso con Claude Code

Estos documentos están diseñados para ser utilizados como contexto en desarrollo con Claude Code. Puedes referenciarlos usando `@file` o incluirlos en `claude.md` según sea necesario.

**Ejemplo:**
```
# En conversación con Claude
"Basándote en @Specs/api-integration/shopify-integration.md, implementa..."
```

## Documentos Disponibles

### Architecture
- `project-structure.md` - Estructura del proyecto y organización de carpetas
- `component-patterns.md` - Patrones de componentes y convenciones

### Types
- `type-definitions.md` - Definiciones de tipos TypeScript del proyecto

### API Integration
- `shopify-integration.md` - Integración con Shopify Admin API

### Guides
- `styles-conventions.md` - Guía de estilos SASS y convenciones CSS

---

**Mantenido por:** Equipo de desarrollo
**Versión:** 1.0.0