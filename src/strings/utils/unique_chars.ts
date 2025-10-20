export function uniqueCharacters(str: string): number {
  const normalizedStr = str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  const uniqueChars = new Set(normalizedStr);

  return uniqueChars.size;
}
