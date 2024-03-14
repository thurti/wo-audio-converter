// utils, helpers, stuff that doesn't fit anywhere else

export function generateRandomId(name: string): string {
  return `${name}-${(Math.random() * 10e15).toString(16)}`;
}

export function getSystemPreferedColorScheme(): "auto" | "light" | "dark" {
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "auto";
}
