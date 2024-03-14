import type { ConfigFormatOption } from "@/config";
import type { SelectedSettings } from "@/store";

export function setDataAsUrlParam(
  name: string,
  data: {},
  replaceState = false,
): void {
  const url = new URL(window.location.href);
  url.searchParams.set(name, JSON.stringify(data));

  if (replaceState) {
    window.history.replaceState({}, "", url.toString());
  } else {
    window.history.pushState({}, "", url.toString());
  }
}

export function getDataFromUrlParam<T>(name: string): T | null {
  const url = new URL(window.location.href);
  const data = url.searchParams.get(name);

  return data ? JSON.parse(data) : null;
}

export function getShareSettingsUrl(
  format: ConfigFormatOption,
  settings: SelectedSettings,
): string {
  const url = new URL(window.location.href);

  url.searchParams.set("format", JSON.stringify(format));
  url.searchParams.set("settings", JSON.stringify(settings));

  return url.toString();
}
