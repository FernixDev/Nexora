import type { CardioStartingPoint, Goal, StrengthStartingPoint } from '../types/onboarding';

interface StartingPointCopy {
  title: string;
  description: string;
}

/** Traduce el punto de partida de fuerza inferido a un mensaje humano, positivo y no juzgador. */
export const STRENGTH_STARTING_POINT_COPY: Record<StrengthStartingPoint, StartingPointCopy> = {
  foundation: {
    title: 'Construyendo una base sólida',
    description: 'Empezaremos por lo esencial: técnica, control y progresión constante.',
  },
  returning: {
    title: 'Recuperando tu ritmo',
    description: 'Vamos a ayudarte a retomar el entrenamiento de fuerza con seguridad.',
  },
  experienced: {
    title: 'Subiendo el nivel',
    description: 'Partimos de tu experiencia para seguir progresando.',
  },
};

/** Traduce el punto de partida de cardio inferido a un mensaje humano, positivo y no juzgador. */
export const CARDIO_STARTING_POINT_COPY: Record<CardioStartingPoint, StartingPointCopy> = {
  low_impact: {
    title: 'Cardio de bajo impacto',
    description: 'Comenzaremos con sesiones suaves que cuidan tu cuerpo mientras ganas base.',
  },
  walk_run: {
    title: 'Combinando caminata y carrera',
    description: 'Tu punto de partida permite alternar caminata y carrera de forma progresiva.',
  },
  running_base: {
    title: 'Con base de carrera',
    description: 'Partimos de tu capacidad actual para seguir construyendo resistencia.',
  },
};

export const GOAL_LABELS: Record<Goal, string> = {
  lose_weight: 'Perder peso',
  improve_fitness: 'Mejorar la condición física',
  build_strength: 'Ganar fuerza',
  build_muscle: 'Ganar masa muscular',
  start_running: 'Empezar a correr',
  race_distance: 'Preparar una distancia',
  improve_mobility: 'Mejorar movilidad',
};
