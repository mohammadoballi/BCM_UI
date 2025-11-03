
export function genderToNumber(gender: string): number {
  if (!gender) return 0;
  return gender.toLowerCase() === 'female' ? 1 : 0;
}


export function numberToGender(genderNumber: number | string): string {
  const num = typeof genderNumber === 'string' ? parseInt(genderNumber) : genderNumber;
  return num === 1 ? 'Female' : 'Male';
}


export function isValidGender(gender: string): boolean {
  if (!gender) return false;
  const normalized = gender.toLowerCase();
  return normalized === 'male' || normalized === 'female';
}
