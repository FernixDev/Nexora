const MIN_AGE_YEARS = 10;
const MAX_AGE_YEARS = 100;

/** Calcula la edad en años a partir de una fecha de nacimiento ISO (yyyy-mm-dd). */
export function calculateAge(birthDateIso: string, referenceDate: Date = new Date()): number {
  const birthDate = new Date(birthDateIso);
  let age = referenceDate.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    referenceDate.getMonth() > birthDate.getMonth() ||
    (referenceDate.getMonth() === birthDate.getMonth() && referenceDate.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

/**
 * Valida que una fecha de nacimiento sea una fecha real, no futura, y dentro
 * de un rango de edad razonable. No es una validación médica, solo evita
 * errores de introducción de datos.
 */
export function isValidBirthDate(birthDateIso: string, referenceDate: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDateIso)) return false;

  const birthDate = new Date(birthDateIso);
  if (Number.isNaN(birthDate.getTime())) return false;
  if (birthDate.getTime() > referenceDate.getTime()) return false;

  const age = calculateAge(birthDateIso, referenceDate);
  return age >= MIN_AGE_YEARS && age <= MAX_AGE_YEARS;
}
