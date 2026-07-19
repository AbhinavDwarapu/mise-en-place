import { describe, expect, it } from "vitest";
import { hello } from "./hello";

describe("hello endpoint", () => {
  it("greets the given name", async () => {
    const response = await hello({ name: "world" });
    expect(response).toEqual({ message: "Hello world!" });
  });
});
