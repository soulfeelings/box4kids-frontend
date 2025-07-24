// orval.config.ts
export default {
  api: {
    input: "./src/generated/api.json",
    output: {
      mode: "single",
      target: "./src/api-client/index.ts",
      schemas: "./src/api-client/model",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/api-client/customFetch.ts",
          name: "customFetch",
        },
      },
    },
  },
};
