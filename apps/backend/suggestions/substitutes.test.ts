import { MockLanguageModelV4 } from "ai/test";
import { describe, expect, it } from "vitest";
import { suggestSubstitutes } from "./substitutes";

function modelAnswering(json: unknown) {
  return new MockLanguageModelV4({
    doGenerate: {
      content: [{ type: "text", text: JSON.stringify(json) }],
      finishReason: { unified: "stop", raw: undefined },
      usage: {
        inputTokens: {
          total: 1,
          noCache: 1,
          cacheRead: undefined,
          cacheWrite: undefined,
        },
        outputTokens: { total: 1, text: 1, reasoning: undefined },
      },
      warnings: [],
    },
  });
}

describe("suggestSubstitutes", () => {
  it("returns the model's suggestions", async () => {
    const model = modelAnswering({ substitutes: ["chard", "collard greens"] });

    await expect(suggestSubstitutes(model, "kale", [])).resolves.toEqual([
      "chard",
      "collard greens",
    ]);
  });

  it("drops duplicates, existing substitutes and the ingredient itself", async () => {
    const model = modelAnswering({
      substitutes: ["chard", " chard ", "Kale", "Collard greens", "arugula"],
    });

    await expect(
      suggestSubstitutes(model, "collard greens", ["kale"]),
    ).resolves.toEqual(["chard", "arugula"]);
  });

  it("caps the suggestions at three", async () => {
    const model = modelAnswering({
      substitutes: ["chard", "arugula", "spinach", "cabbage"],
    });

    await expect(
      suggestSubstitutes(model, "kale", []),
    ).resolves.toEqual(["chard", "arugula", "spinach"]);
  });
});
