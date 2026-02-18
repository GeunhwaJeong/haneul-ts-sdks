import type { HaneulCodegenConfig } from "@haneullabs/codegen";

const config: HaneulCodegenConfig = {
  output: "./src/contracts",
  packages: [
    {
      package: "@local-pkg/counter",
      path: "./move/counter",
    },
  ],
};

export default config;
