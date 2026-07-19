import { api } from "encore.dev/api";

interface HelloResponse {
  message: string;
}

export const hello = api(
  { expose: true, method: "GET", path: "/hello/:name" },
  async ({ name }: { name: string }): Promise<HelloResponse> => {
    return { message: `Hello ${name}!` };
  },
);
