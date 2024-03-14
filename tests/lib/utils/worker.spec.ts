import {
  registerServiceWorker,
  addUrlToCache,
  preloadFilesToCache,
  deleteCachesStartWith,
  isWorkerAllowed,
} from "@/lib/utils/worker";
import { describe } from "vitest";

describe("lib/utils/worker", () => {
  describe("#registerServiceWorker()", () => {
    vi.stubGlobal("navigator", {
      serviceWorker: {
        register: () => Promise.resolve(),
      },
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it("should register the service worker", () => {
      const registerSpy = vi.spyOn(navigator.serviceWorker, "register");
      registerServiceWorker();
      expect(registerSpy).toHaveBeenCalled();
    });

    it("adds the version to the service worker registration", async () => {
      const registerSpy = vi.spyOn(navigator.serviceWorker, "register");
      await registerServiceWorker("1.0.0");
      expect(registerSpy).toHaveBeenCalledWith(
        "/sw.js?v=1.0.0",
        expect.anything(),
      );
    });
  });

  describe("#addUrlToCache()", () => {
    const cache = {
      add: () => vi.fn(),
      match: () => vi.fn(),
    } as unknown as Cache;

    afterEach(() => {
      vi.resetAllMocks();
    });

    it("should check if the url is already in the cache and resolve", async () => {
      const matchSpy = vi.spyOn(cache, "match").mockResolvedValue(true);
      const addSpy = vi.spyOn(cache, "add");
      await addUrlToCache("test", cache);
      expect(matchSpy).toHaveBeenCalledWith("test");
      expect(addSpy).not.toHaveBeenCalled();
    });

    it("should add the url to the cache if it is not already in the cache", async () => {
      const matchSpy = vi.spyOn(cache, "match").mockResolvedValue(undefined);
      const addSpy = vi.spyOn(cache, "add").mockResolvedValue(true);
      await addUrlToCache("test", cache);
      expect(matchSpy).toHaveBeenCalledWith("test");
      expect(addSpy).toHaveBeenCalledWith("test");
    });
  });

  describe("#preloadFilesToCache()", () => {
    const cache = {
      add: () => vi.fn(),
      match: () => Promise.resolve(undefined),
    } as unknown as Cache;

    beforeAll(() => {
      vi.stubGlobal("caches", {
        open: () => Promise.resolve(cache),
      });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    afterAll(() => {
      vi.unstubAllGlobals();
    });

    it("should add all files to the cache", async () => {
      const openSpy = vi.spyOn(caches, "open");
      const addSpy = vi.spyOn(cache, "add");

      await preloadFilesToCache(["test1", "test2"], "testCache");

      expect(openSpy).toHaveBeenCalledWith("testCache");
      expect(addSpy).toHaveBeenNthCalledWith(1, "test1");
      expect(addSpy).toHaveBeenNthCalledWith(2, "test2");
    });
  });

  describe("#deleteOldCaches()", () => {
    beforeAll(() => {
      vi.stubGlobal("caches", {
        keys: () =>
          Promise.resolve(["testCache1", "testCache2", "anotherCache"]),
        delete: () => Promise.resolve(),
      });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    afterAll(() => {
      vi.unstubAllGlobals();
    });

    it("should delete all caches starting with a certain string", async () => {
      const deleteSpy = vi.spyOn(caches, "delete");

      await deleteCachesStartWith("testCache");

      expect(deleteSpy).toHaveBeenNthCalledWith(1, "testCache1");
      expect(deleteSpy).toHaveBeenNthCalledWith(2, "testCache2");
      expect(deleteSpy).not.toHaveBeenCalledWith("anotherCache");
    });
  });

  describe("#isWorkerAllowed()", () => {
    afterEach(() => {
      vi.resetAllMocks();
      vi.unstubAllGlobals();
    });

    it("should return false if cookies are not allowed", () => {
      vi.stubGlobal("navigator", {
        cookieEnabled: false,
      });

      const isAllowed = isWorkerAllowed();
      expect(isAllowed).toBe(false);
    });

    it("should return false if service workers are not supported", () => {
      vi.stubGlobal("navigator", {
        cookieEnabled: true,
      });

      const isAllowed = isWorkerAllowed();
      expect(isAllowed).toBe(false);
    });

    it("should return true if cookies are allowed and service workers are supported", () => {
      vi.stubGlobal("navigator", {
        cookieEnabled: true,
        serviceWorker: {},
      });

      const isAllowed = isWorkerAllowed();
      expect(isAllowed).toBe(true);
    });
  });
});
