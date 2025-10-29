import config from "../src/2master_config_file";

describe("config", () => {
  it("should export a config object", () => {
    expect(typeof config).toBe("object");
  });
});
