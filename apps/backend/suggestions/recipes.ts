import { generateText, Output, type LanguageModel } from "ai";
import { api } from "encore.dev/api";
import { z } from "zod";
import { gatewayModel } from "./model";

export interface RecipeIdea {
  name: string;
  usedIngredients: string[];
  extraIngredients: string[];
}

interface RecipeIdeasRequest {
  selected: string[];
  kitchen: string[];
}

interface RecipeIdeasResponse {
  ideas: RecipeIdea[];
}

const recipeIdeasSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string(),
      usedIngredients: z.array(z.string()),
      extraIngredients: z.array(z.string()),
    }),
  ),
});

export async function suggestRecipes(
  model: LanguageModel,
  selected: string[],
  kitchen: string[],
): Promise<RecipeIdea[]> {
  const kitchenNames = new Map(
    [...kitchen, ...selected].map((name) => [name.trim().toLowerCase(), name]),
  );
  const selectedKeys = new Set(
    selected.map((name) => name.trim().toLowerCase()),
  );
  const otherKitchen = kitchen.filter(
    (name) => !selectedKeys.has(name.trim().toLowerCase()),
  );

  const { output } = await generateText({
    model,
    output: Output.object({ schema: recipeIdeasSchema }),
    prompt: [
      `Suggest 3 to 4 simple recipes that use up these ingredients: ${selected.join(", ")}.`,
      otherKitchen.length > 0
        ? `The kitchen also has: ${otherKitchen.join(", ")}.`
        : "",
      "Prefer recipes that need little or nothing beyond the kitchen.",
      "In usedIngredients list only kitchen ingredients, echoed exactly as given.",
      "In extraIngredients list what has to be bought, as short lowercase names.",
    ]
      .filter((line) => line !== "")
      .join(" "),
  });

  return output.recipes.slice(0, 4).map((recipe) => {
    const usedIngredients = [
      ...new Set(
        recipe.usedIngredients
          .map((entry) => kitchenNames.get(entry.trim().toLowerCase()))
          .filter((entry) => entry !== undefined),
      ),
    ];
    const extraIngredients = [
      ...new Set(recipe.extraIngredients.map((entry) => entry.trim())),
    ].filter((entry) => entry !== "" && !kitchenNames.has(entry.toLowerCase()));
    return { name: recipe.name, usedIngredients, extraIngredients };
  });
}

export const recipes = api(
  { expose: true, method: "POST", path: "/suggestions/recipes" },
  async ({ selected, kitchen }: RecipeIdeasRequest): Promise<RecipeIdeasResponse> => {
    return { ideas: await suggestRecipes(gatewayModel(), selected, kitchen) };
  },
);
