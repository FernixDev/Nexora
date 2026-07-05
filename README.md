# Nexora

**Tu siguiente versión**

Nexora es una aplicación deportiva multiusuario pensada para acompañar el progreso físico de cada persona: fuerza, carrera/cardio y movilidad, con planes que se adaptan a su nivel, estado físico, peso, experiencia y evolución en el tiempo.

> ⚠️ **Proyecto en desarrollo activo.** Esta es la base técnica inicial del proyecto. Todavía no incluye autenticación, base de datos, entrenamientos reales ni perfiles de usuario funcionales.

## Visión del producto

Nexora quiere ser el compañero de entrenamiento que se adapta a ti, no al revés. En lugar de planes genéricos, la idea es construir una experiencia que evolucione contigo: si estás empezando, si vuelves tras una lesión, o si ya tienes experiencia, tu plan debe reflejarlo.

## Funcionalidades previstas

### Fuerza
- Entrenamientos por grupos musculares.
- Niveles principiante, intermedio y avanzado.
- Planes guiados con series, repeticiones, peso y seguimiento de progreso.
- Vídeos propios de demostración de ejercicios.

### Carrera y cardio
- Planes adaptados al estado físico de cada usuario.
- Caminatas, carrera continua, fartlek, cuestas y series.
- Planes organizados por distancia y objetivo.

### Movilidad
- Estiramientos, movilidad articular y recuperación.
- Sesiones guiadas.

### Perfil de usuario
- Cuenta propia y datos privados (peso, altura, nivel por disciplina, objetivos, experiencia, limitaciones y progreso).

_Ninguna de estas funcionalidades está implementada todavía: forman parte del roadmap del producto._

## Stack tecnológico

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) como entorno de desarrollo y build
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) para la instalación como PWA
- ESLint + TypeScript en modo estricto
- Diseño mobile-first, responsive, con una estética inspirada en el lenguaje visual *Liquid Glass*
- Futuro: [Supabase](https://supabase.com/) para base de datos y autenticación multiusuario

## Estado actual del desarrollo

- [x] Base técnica del proyecto (React + TypeScript + Vite)
- [x] Configuración como PWA instalable
- [x] Estructura de carpetas escalable
- [x] Pantalla de bienvenida inicial con la identidad de marca
- [x] Modo claro/oscuro según preferencia del sistema
- [x] Autenticación multiusuario (registro, confirmación de correo, login, recuperación de contraseña, cierre de sesión)
- [x] Perfiles privados en Supabase con Row Level Security (cada usuario solo accede a su propio perfil)
- [ ] Gestión de entrenamientos (fuerza, carrera/cardio, movilidad)
- [ ] Onboarding deportivo y adaptación de planes
- [ ] Integración con wearables

## Roadmap inicial

1. Base técnica y configuración del proyecto *(actual)*
2. Diseño del sistema visual y componentes base reutilizables
3. Integración con Supabase (base de datos y autenticación)
4. Perfil de usuario y onboarding
5. Módulo de fuerza
6. Módulo de carrera y cardio
7. Módulo de movilidad
8. Adaptación de planes según nivel, estado físico y progreso
9. Integraciones con wearables

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd nexora

# Instalar dependencias
npm install

# Copiar las variables de entorno de ejemplo
cp .env.example .env.local

# Arrancar el entorno de desarrollo
npm run dev
```

Rellena `.env.local` con la URL y la Publishable key de tu propio proyecto de Supabase (panel de Supabase → Project Settings → API). Nunca uses la `service_role` ni ninguna clave secreta en este archivo, y no lo subas nunca al repositorio.

## Scripts disponibles

| Script              | Descripción                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`        | Arranca el servidor de desarrollo de Vite.         |
| `npm run build`      | Compila TypeScript y genera el build de producción.|
| `npm run preview`    | Sirve localmente el build de producción.           |
| `npm run lint`       | Ejecuta ESLint sobre todo el proyecto.              |
| `npm run typecheck`  | Verifica los tipos de TypeScript sin generar salida.|

## Desarrollo asistido por agentes

Nexora se desarrolla con ayuda de agentes de IA (Claude Code) para acelerar la implementación técnica. Sin embargo, **todas las decisiones de producto, arquitectura y revisión de código son humanas**: los agentes ejecutan misiones concretas dentro de un contexto y unas reglas definidas por el equipo (ver [`CLAUDE.md`](./CLAUDE.md)), pero no deciden el rumbo del producto.

## Contribuir

Este proyecto está en una fase muy temprana y aún no tiene un proceso de contribución externo definido. Si tienes sugerencias, abre un issue.
