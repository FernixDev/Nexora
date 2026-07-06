export function WelcomeStep() {
  return (
    <div className="onboarding-step">
      <div className="onboarding-step__header">
        <span className="onboarding-step__eyebrow text-label">Nexora</span>
        <h1 className="onboarding-step__title text-title">Vamos a conocerte un poco mejor</h1>
      </div>
      <p className="text-body">
        Esto no es un examen y no hay respuestas buenas ni malas. Solo queremos entender dónde estás hoy para elegir
        un punto de partida que tenga sentido para ti.
      </p>
      <p className="text-small text-secondary">
        Te haremos unas pocas preguntas sencillas sobre tu situación actual, tu experiencia y tus objetivos. Con eso,
        Nexora construirá tu punto de partida en fuerza y en cardio.
      </p>
    </div>
  );
}
