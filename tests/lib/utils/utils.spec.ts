import { generateRandomId } from "@/lib/utils/utils";
import { describe } from "vitest";

describe("lib/utils", () => {
  describe("#generateRandomId()", () => {
    it("should generate a random id", () => {
      const id = generateRandomId("test");
      expect(id).toMatch(/^test-.+$/);
    });
  });
});
