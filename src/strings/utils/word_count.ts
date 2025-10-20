export function wordCount(str: string): number {
  if (!str) return 0;

  const words = str.trim().split(' ');
  return words.length;
}
