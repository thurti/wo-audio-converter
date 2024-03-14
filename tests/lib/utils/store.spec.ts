import { config } from "@/config";
import {
  createPersistentBooleanStore,
  createPersistentJsonStore,
  createPersistentNumberStore,
} from "@/lib/utils/store";
import { get } from "svelte/store";
import { describe } from "vitest";

const prefix = config.localStoragePrefix;

describe("lib/store-utils", () => {
  afterEach(() => {
    localStorage.removeItem(`${prefix}-test`);
  });

  describe("#createPersistentNumberStore()", () => {
    it("should create a writable store", () => {
      const store = createPersistentNumberStore("test", 0);
      expect(store).toBeDefined();
    });

    it("should set the default value", () => {
      const store = createPersistentNumberStore("test", 10);
      expect(store).toBeDefined();
      expect(get(store)).toBe(10);
    });

    it("should get the value from localStorage", () => {
      localStorage.setItem(`${prefix}-test`, "20");
      const store = createPersistentNumberStore("test", 10);
      expect(get(store)).toBe(20);
    });

    it("should set the value to localStorage", () => {
      const store = createPersistentNumberStore("test", 10);
      store.set(30);
      expect(get(store)).toBe(30);
      expect(localStorage.getItem(`${prefix}-test`)).toBe("30");
    });
  });

  describe("#createPersistentBooleanStore()", () => {
    it("should create a writable store", () => {
      const store = createPersistentBooleanStore("test", false);
      expect(store).toBeDefined();
    });

    it("should set the default value to false", () => {
      const store = createPersistentBooleanStore("test", false);
      expect(store).toBeDefined();
      expect(get(store)).toBe(false);
    });

    it("should set the default value to true", () => {
      const store = createPersistentBooleanStore("test", true);
      expect(store).toBeDefined();
      expect(get(store)).toBe(true);
    });

    it("should get the value from localStorage", () => {
      localStorage.setItem(`${prefix}-test`, "true");
      const store = createPersistentBooleanStore("test", false);
      expect(get(store)).toBe(true);
    });

    it("should set the value to localStorage", () => {
      const store = createPersistentBooleanStore("test", false);
      store.set(true);
      expect(get(store)).toBe(true);
      expect(localStorage.getItem(`${prefix}-test`)).toBe("true");
    });
  });

  describe("#createPersistentJsonStore()", () => {
    const json = { foo: "bar" };

    it("should create a writable store", () => {
      const store = createPersistentJsonStore("test", json);
      expect(store).toBeDefined();
    });

    it("should set the default value", () => {
      const store = createPersistentJsonStore("test", json);
      expect(store).toBeDefined();
      expect(get(store)).toEqual(json);
    });

    it("should get the value from localStorage", () => {
      localStorage.setItem(`${prefix}-test`, JSON.stringify({ a: 1, b: 2 }));
      const store = createPersistentJsonStore("test", json);
      expect(get(store)).toEqual({ a: 1, b: 2 });
    });

    it("should set the value to localStorage", () => {
      const store = createPersistentJsonStore<any>("test", json);
      store.set({ a: 1, b: 2 });
      expect(get(store)).toEqual({ a: 1, b: 2 });
      expect(JSON.parse(localStorage.getItem(`${prefix}-test`))).toEqual({
        a: 1,
        b: 2,
      });
    });
  });
});
