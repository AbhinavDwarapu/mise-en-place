import { generateText, Output, type LanguageModel } from "ai";
import { api } from "encore.dev/api";
import { z } from "zod";
import { gatewayModel } from "./model";

interface SubstitutesRequest {
  name: string;
  existing: string[];
}

interface SubstitutesResponse {
  substitutes: string[];
}

const substitutesSchema = z.object({
  substitutes: z.array(z.string()),
});

export async function suggestSubstitutes(
  model: LanguageModel,
  name: string,
  existing: string[],
): Promise<string[]> {
  const { output } = await generateText({
    model,
    output: Output.object({ schema: substitutesSchema }),
    prompt: [
      `Suggest 2 to 3 common cooking substitutes for the grocery ingredient "${name}".`,
      existing.length > 0
        ? `Do not suggest any of these: ${existing.join(", ")}.`
        : "",
      "Use short lowercase ingredient names a shopper would recognise in a supermarket.",
    ]
      .filter((line) => line !== "")
      .join(" "),
  });

  const excluded = new Set(
    [name, ...existing].map((entry) => entry.trim().toLowerCase()),
  );
  const unique = [...new Set(output.substitutes.map((entry) => entry.trim()))];
  return unique
    .filter((entry) => entry !== "" && !excluded.has(entry.toLowerCase()))
    .slice(0, 3);
}

export const substitutes = api(
  { expose: true, method: "POST", path: "/suggestions/substitutes" },
  async ({ name, existing }: SubstitutesRequest): Promise<SubstitutesResponse> => {
    return { substitutes: await suggestSubstitutes(gatewayModel(), name, existing) };
  },
);
