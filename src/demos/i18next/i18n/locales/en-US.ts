export const enUS = {
  common: {
    welcome: "Welcome to my React demo",
    description: "This is an example of internationalization using i18next.",
    changeLanguage: "Change Language",
    currentLanguage: "Current Language",
  },
  demo: {
    greeting: "Hello, {{name}}!",
    itemCount_one: "{{count}} item in total",
    itemCount_other: "{{count}} items in total",
    interpolation: "Interpolation: current time is {{date}}",
    nested: {
      example: "This is a nested namespace example text",
    },
    richText:
      "Use the <bold>Trans component</bold> to embed <anchor>HTML tags</anchor> or React components in translated text.",
  },
  features: {
    title: "i18n Feature Showcase",
    basic: "Basic Translation",
    basicDesc: "Use the t() function for simple text translation.",
    interpolation: "String Interpolation",
    interpolationDesc:
      "Embed dynamic variables like username, count, etc. in translated text.",
    pluralization: "Pluralization",
    pluralizationDesc:
      "Automatically select singular or plural forms based on count.",
    nestedKey: "Nested Keys",
    nestedKeyDesc:
      "Translation resources support multi-level nesting for organizing copy in large projects.",
    namespace: "Namespaces",
    namespaceDesc:
      "Split translation resources by module, supporting on-demand loading.",
    richText: "Rich Text (HTML Tags)",
    richTextDesc:
      "Use the Trans component to embed styled HTML elements or custom React components in translated text.",
  },
} as const;
