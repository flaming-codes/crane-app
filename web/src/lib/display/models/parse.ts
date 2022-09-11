export function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function getCssVarRemToPixels(name: string) {
  return convertRemToPixels(
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace('rem', '')
    )
  );
}
