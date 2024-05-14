// Make template string.
// The mapped key has the form [key].
export function makeTemplate(template: string, data: {[key in string]: string}): string {
  let result = template;

  Object.entries(data).map(([key, value]) => {
    const mappedKey = `[${key}]`;
    result = result.replaceAll(mappedKey, value);
  });

  return result;
}
