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

## Stack tecnológico

- React + TypeScript
- Vite como bundler y entorno de desarrollo
- `vite-plugin-pwa` para la capa PWA instalable
- ESLint + TypeScript en modo estricto
- Futuro: Supabase (base de datos, autenticación, storage)

## Estado actual

Este es el andamiaje inicial del proyecto. Existe una pantalla de bienvenida mínima con la identidad de marca (nombre, eslogan y mensaje de bienvenida). **Todavía no existen**: autenticación, conexión a Supabase, entrenamientos, perfiles de usuario ni ninguna funcionalidad de negocio real. No asumas que existen ni construyas sobre datos de ejemplo como si fueran reales.

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
