import { config } from "@/config";
import { writable, type Writable } from "svelte/store";

const prefix = config?.localStoragePrefix
  ? `${config.localStoragePrefix}-`
  : "";

export function createPersistentNumberStore(
  name: string,
  defaultValue: number,
): Writable<number> {
  const { subscribe, set, update } = writable<number>(defaultValue);
  const storeName = `${prefix}${name}`;

  try {
    set(Number(localStorage.getItem(storeName) ?? defaultValue.toString()));
  } catch (error) {
    console.warn(error);
  }

  return {
    update,
    subscribe,
    set: (value: number) => {
      try {
        localStorage.setItem(storeName, value.toString());
      } catch (error) {
        console.warn(error);
      }

      set(value);
    },
  };
}

export function createPersistentBooleanStore(
  name: string,
  defaultValue: boolean,
): Writable<boolean> {
  const { subscribe, set, update } = writable<boolean>(defaultValue);
  const storeName = `${prefix}${name}`;

  try {
    if (localStorage.getItem(storeName) === null) {
      set(defaultValue);
    } else {
      set(localStorage.getItem(storeName) === "true");
    }
  } catch (error) {
    console.warn(error);
  }

  return {
    update,
    subscribe,
    set: (value: boolean) => {
      try {
        localStorage.setItem(storeName, value.toString());
      } catch (error) {
        console.warn(error);
      }

      set(value);
    },
  };
}

export function createPersistentJsonStore<T>(
  name: string,
  defaultValue: T,
): Writable<T> {
  const { subscribe, set, update } = writable<T>(defaultValue);
  const storeName = `${prefix}${name}`;

  try {
    set(
      JSON.parse(
        localStorage.getItem(storeName) ?? JSON.stringify(defaultValue),
      ),
    );
  } catch (error) {
    console.warn(error);
  }

  return {
    update,
    subscribe,
    set: (value: T) => {
      try {
        localStorage.setItem(storeName, JSON.stringify(value));
      } catch (error) {
        console.warn(error);
      }

      set(value);
    },
  };
}
