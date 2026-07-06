# CLAUDE.md — Contexto permanente del proyecto Nexora

Este archivo es el contexto de referencia para cualquier agente (Claude u otro) que trabaje en este repositorio. Léelo antes de empezar cualquier misión.

## Identidad del producto

- **Nombre:** Nexora
- **Eslogan:** "Tu siguiente versión"
- **Objetivo general:** Nexora es una aplicación deportiva multiusuario que acompaña a cada persona en su progreso físico: fuerza, carrera/cardio y movilidad, adaptando los planes a su nivel, estado físico, peso, experiencia y evolución en el tiempo.
- **Repositorio:** público en GitHub. Cualquier código, commit o archivo debe asumirse visible para cualquier persona.

## Reglas no negociables

1. **Nunca introducir secretos en Git.** Ninguna clave, token o credencial real debe aparecer en el código, en `.env`, ni en el historial de commits. Usa siempre `.env.example` como referencia y variables de entorno reales fuera del repositorio.
2. **Mobile-first y responsive.** Todo diseño y componente se piensa primero para pantallas móviles y se expande hacia tablet/desktop después.
3. **Estética Liquid Glass.** La identidad visual se inspira en el lenguaje "Liquid Glass" de Apple (superficies translúcidas, blur, profundidad sutil, luz), sin copiar componentes propietarios de Apple ni usar sus assets.
4. **Arquitectura limpia.** Mantén la separación de responsabilidades entre `components`, `pages`, `layouts`, `hooks`, `services`, `types`, `utils` e `integrations`. La lógica de negocio no debe vivir dentro de componentes de UI.
5. **Reutiliza antes de duplicar.** Antes de crear un componente, hook o util nuevo, revisa si ya existe algo equivalente reutilizable.
6. **Analiza antes de modificar.** Antes de tocar código existente, entiende la estructura y las decisiones ya tomadas en el repositorio.
7. **No toques lo que no es necesario.** Cada misión debe limitar su alcance a lo solicitado; evita modificar archivos o áreas no relacionadas.
8. **Cada misión termina verificando.** Antes de dar una tarea por terminada, ejecuta las comprobaciones disponibles del proyecto: `npm run lint`, `npm run typecheck` y `npm run build`. Corrige cualquier error antes de reportar éxito.
9. **Preparado para crecer.** El proyecto debe mantenerse listo para integrar Supabase (base de datos y autenticación), la instalación como PWA, y futuras integraciones con wearables, sin necesidad de reestructurar la base del proyecto.

## Atribución de Git (GIT ATTRIBUTION)

- Todos los commits deben quedar atribuidos únicamente al usuario humano de Git configurado.
- Nunca añadas a Claude, Anthropic, asistentes de IA o agentes como coautores.
- Nunca añadas trailers `Co-Authored-By` relacionados con IA salvo que el usuario lo pida explícitamente.
- El desarrollo asistido por IA puede documentarse de forma transparente en `README.md`, pero las herramientas de IA no deben aparecer como autores o coautores de commits en Git.

## Supabase

- El frontend usa únicamente la **Publishable key** (`VITE_SUPABASE_PUBLISHABLE_KEY`) y la **Project URL** (`VITE_SUPABASE_URL`).
- Nunca uses en el cliente `service_role`, `secret key`, contraseñas de base de datos ni ninguna clave privada.
- `.env.local` nunca se versiona ni se incluye en un commit; usa siempre `.env.example` como referencia.
- La seguridad de los datos futuros debe basarse en Row Level Security (RLS) y políticas explícitas, nunca en desactivar RLS para "hacer funcionar" algo.
- Ningún agente debe imprimir credenciales completas (URLs con tokens, claves, valores de `.env.local`) en respuestas, commits o logs.
- Toda tabla con datos de usuario debe tener RLS habilitado desde el momento en que se crea, no añadido después.
- Cualquier tabla privada debe tener una estrategia explícita de autorización (policies concretas), no depender de RLS "por defecto" ni de suposiciones.
- Las políticas de RLS deben probarse con más de un usuario antes de darlas por buenas (acceso propio permitido, acceso ajeno denegado, acceso anónimo denegado).
- El frontend nunca debe ser la única barrera de acceso a datos: cualquier filtro de seguridad debe existir en PostgreSQL (RLS), no solo en la lógica de React.

## Stack tecnológico

- React + TypeScript
- Vite como bundler y entorno de desarrollo
- `vite-plugin-pwa` para la capa PWA instalable
- ESLint + TypeScript en modo estricto
- Futuro: Supabase (base de datos, autenticación, storage)

## Estado actual

Existe autenticación multiusuario real (registro, confirmación de correo, login, recuperación de contraseña, cierre de sesión) contra Supabase Auth, con una tabla `public.profiles` (1:1 con `auth.users`, creada automáticamente vía trigger) protegida por RLS.

Existe además un onboarding deportivo adaptativo (`/onboarding`) que recoge datos personales (nombre, fecha de nacimiento, altura, peso) y respuestas objetivas sobre el estado físico, experiencia y objetivos del usuario, y los guarda en `public.fitness_profiles` (1:1 con `auth.users`, protegida por RLS). A partir de esas respuestas, Nexora infiere internamente un punto de partida de fuerza y otro de cardio mediante reglas deterministas (ver `src/utils/fitnessInference.ts`); **el usuario nunca elige directamente "principiante/intermedio/avanzado" ni un nivel de fuerza o cardio**. La edad se calcula siempre dinámicamente a partir de `birth_date` (`src/utils/age.ts`); no se almacena ninguna columna `age`. Tras completar el onboarding, `profiles.onboarding_completed` pasa a `true` y el usuario entra en una pantalla privada temporal que muestra su punto de partida.

**Todavía no existen**: entrenamientos, planes guiados, ejercicios, vídeos, calendario, estadísticas ni ningún dashboard definitivo. No asumas que existen ni construyas sobre datos de ejemplo como si fueran reales.

## Visión funcional futura de Nexora

### A. Fuerza
- Entrenamientos organizados por grupos musculares.
- Niveles: principiante, intermedio y avanzado.
- Planes guiados paso a paso.
- Registro de series, repeticiones, peso y progreso a lo largo del tiempo.
- Vídeos propios de demostración de ejercicios (no contenido de terceros).

### B. Carrera y cardio
- Planes adaptados al estado físico de cada usuario.
- Caminatas para quienes no deben empezar corriendo directamente.
- Carrera continua.
- Fartlek.
- Cuestas.
- Series.
- Planes organizados por distancia objetivo y meta del usuario.

### C. Movilidad
- Estiramientos.
- Ejercicios de movilidad articular.
- Sesiones de recuperación.
- Sesiones guiadas paso a paso.

### D. Perfil del usuario
- Cuenta propia por usuario (multiusuario).
- Datos privados del usuario.
- Peso y altura.
- Nivel por disciplina (fuerza, carrera, movilidad).
- Objetivos personales.
- Experiencia previa.
- Limitaciones físicas o lesiones.
- Historial de progreso.

## Cómo trabajar en este repo

- Antes de una nueva misión: revisa la estructura de `src/` y los README de cada carpeta para entender dónde debe vivir el código nuevo.
- Al añadir una integración externa (por ejemplo Supabase), colócala dentro de `src/integrations/<nombre-integración>/` y expón su acceso a través de `src/services/`.
- Al terminar cualquier misión, ejecuta y verifica:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- No hagas `push` a GitHub salvo que se te pida explícitamente.
- No añadas dependencias innecesarias: evalúa si el problema se puede resolver con lo que ya existe antes de instalar una librería nueva.
