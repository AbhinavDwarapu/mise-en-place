import { createGateway, type LanguageModel } from "ai";
import { secret } from "encore.dev/config";

const aiGatewayApiKey = secret("AIGatewayApiKey");

export function gatewayModel(): LanguageModel {
  return createGateway({ apiKey: aiGatewayApiKey() })(
    "anthropic/claude-opus-4.8",
  );
}
