export function isPalindrome(str: string): boolean {
  const normalizedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const reversedStr = normalizedStr.split('').reverse().join('');

  return normalizedStr === reversedStr;
}
