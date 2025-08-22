export const escapeHtml = (str: string | number | boolean): string =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export function html(
  strings: TemplateStringsArray,
  ...values: (string | number | boolean | null | undefined)[]
): string {
  let raw = strings.reduce((result, str, i) => {
    const val = values[i];
    return result + str + (val != null ? val : '');
  }, '');

  const lines = raw.split('\n');
  const indentSizes = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const m = line.match(/^(\s*)/);
      return m?.[1]?.length ?? 0;
    });

  const minIndent = Math.min(...indentSizes);

  if (minIndent > 0 && minIndent !== Infinity) {
    raw = lines.map((line) => line.slice(minIndent)).join('\n');
  }

  return raw.trim();
}
