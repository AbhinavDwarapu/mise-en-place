import { generateText, Output, type LanguageModel } from "ai";
import { api } from "encore.dev/api";
import { z } from "zod";
import { gatewayModel } from "./model";

export type IngredientCategory =
  | "produce"
  | "dairy"
  | "meat"
  | "bakery"
  | "frozen"
  | "pantry"
  | "other";

const INGREDIENT_CATEGORIES = [
  "produce",
  "dairy",
  "meat",
  "bakery",
  "frozen",
  "pantry",
  "other",
] as const satisfies readonly IngredientCategory[];

interface CategoriesRequest {
  names: string[];
}

interface CategoriesResponse {
  categories: Record<string, IngredientCategory>;
}

const categoriesSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      category: z.enum(INGREDIENT_CATEGORIES),
    }),
  ),
});

export async function inferCategories(
  model: LanguageModel,
  names: string[],
): Promise<Record<string, IngredientCategory>> {
  if (names.length === 0) return {};

  const { output } = await generateText({
    model,
    output: Output.object({ schema: categoriesSchema }),
    prompt: [
      "Assign each grocery item to the supermarket section it is bought from.",
      `The only valid categories are: ${INGREDIENT_CATEGORIES.join(", ")}.`,
      "Echo each item name exactly as given.",
      `Items: ${names.join(", ")}`,
    ].join(" "),
  });

  const answered = new Map(
    output.items.map((item) => [item.name.trim().toLowerCase(), item.category]),
  );
  const categories: Record<string, IngredientCategory> = {};
  for (const name of names) {
    const category = answered.get(name.trim().toLowerCase());
    if (category !== undefined) {
      categories[name] = category;
    }
  }
  return categories;
}

export const categories = api(
  { expose: true, method: "POST", path: "/suggestions/categories" },
  async ({ names }: CategoriesRequest): Promise<CategoriesResponse> => {
    return { categories: await inferCategories(gatewayModel(), names) };
  },
);
