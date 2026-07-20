import { createGateway, type LanguageModel } from "ai";
import { secret } from "encore.dev/config";

const aiGatewayApiKey = secret("AIGatewayApiKey");

export function gatewayModel(): LanguageModel {
  return createGateway({ apiKey: aiGatewayApiKey() })(
    "google/gemini-2.5-flash-lite",
  );
}
