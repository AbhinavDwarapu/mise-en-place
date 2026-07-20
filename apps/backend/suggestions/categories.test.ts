import { describe, expect, it } from "vitest";
import { inferCategories } from "./categories";
import { modelAnswering } from "./test-model";

describe("inferCategories", () => {
  it("keys categories by the requested names regardless of casing", async () => {
    const model = modelAnswering({
      items: [
        { name: "dragon fruit", category: "produce" },
        { name: "Oat Milk", category: "dairy" },
      ],
    });

    await expect(
      inferCategories(model, ["Dragon Fruit", "oat milk"]),
    ).resolves.toEqual({
      "Dragon Fruit": "produce",
      "oat milk": "dairy",
    });
  });

  it("drops names the model did not answer", async () => {
    const model = modelAnswering({
      items: [{ name: "halloumi", category: "dairy" }],
    });

    await expect(
      inferCategories(model, ["halloumi", "mystery item"]),
    ).resolves.toEqual({ halloumi: "dairy" });
  });

  it("skips the model call for an empty list", async () => {
    const model = modelAnswering({ items: [] });

    await expect(inferCategories(model, [])).resolves.toEqual({});
    expect(model.doGenerateCalls).toHaveLength(0);
  });
});
