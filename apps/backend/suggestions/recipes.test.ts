import { describe, expect, it } from "vitest";
import { suggestRecipes } from "./recipes";
import { modelAnswering } from "./test-model";

describe("suggestRecipes", () => {
  it("returns the model's recipe ideas", async () => {
    const model = modelAnswering({
      recipes: [
        {
          name: "Saag-style greens",
          usedIngredients: ["spinach", "yogurt"],
          extraIngredients: ["flour"],
        },
      ],
    });

    await expect(
      suggestRecipes(model, ["spinach", "yogurt"], ["spinach", "yogurt", "eggs"]),
    ).resolves.toEqual([
      {
        name: "Saag-style greens",
        usedIngredients: ["spinach", "yogurt"],
        extraIngredients: ["flour"],
      },
    ]);
  });

  it("matches used ingredients back to kitchen names and drops unknown ones", async () => {
    const model = modelAnswering({
      recipes: [
        {
          name: "Green omelette",
          usedIngredients: [" Spinach ", "Eggs", "spinach", "tofu"],
          extraIngredients: [],
        },
      ],
    });

    await expect(
      suggestRecipes(model, ["Spinach"], ["Spinach", "Eggs"]),
    ).resolves.toEqual([
      {
        name: "Green omelette",
        usedIngredients: ["Spinach", "Eggs"],
        extraIngredients: [],
      },
    ]);
  });

  it("drops extras that are blank, duplicated or already in the kitchen", async () => {
    const model = modelAnswering({
      recipes: [
        {
          name: "Yogurt flatbreads",
          usedIngredients: ["yogurt"],
          extraIngredients: ["flour", " flour", "Eggs", ""],
        },
      ],
    });

    await expect(
      suggestRecipes(model, ["yogurt"], ["yogurt", "eggs"]),
    ).resolves.toEqual([
      {
        name: "Yogurt flatbreads",
        usedIngredients: ["yogurt"],
        extraIngredients: ["flour"],
      },
    ]);
  });

  it("caps the ideas at four", async () => {
    const idea = (name: string) => ({
      name,
      usedIngredients: ["yogurt"],
      extraIngredients: [],
    });
    const model = modelAnswering({
      recipes: ["a", "b", "c", "d", "e"].map(idea),
    });

    const ideas = await suggestRecipes(model, ["yogurt"], ["yogurt"]);

    expect(ideas.map((entry) => entry.name)).toEqual(["a", "b", "c", "d"]);
  });
});
