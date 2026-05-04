export const zhCN = {
  common: {
    welcome: "欢迎来到我的React演示",
    description: "这是一个使用 i18next 进行国际化的示例。",
    changeLanguage: "切换语言",
    currentLanguage: "当前语言",
  },
  demo: {
    greeting: "你好，{{name}}！",
    itemCount_one: "共 {{count}} 个项目",
    itemCount_other: "共 {{count}} 个项目",
    interpolation: "插值：当前时间是 {{date}}",
    nested: {
      example: "这是嵌套命名空间的示例文本",
    },
    richText:
      "使用 <bold>Trans 组件</bold> 可以在翻译文本中嵌入 <anchor>HTML 标签</anchor> 或 React 组件。",
  },
  features: {
    title: "i18n 功能展示",
    basic: "基础翻译",
    basicDesc: "使用 t() 函数进行简单的文本翻译。",
    interpolation: "字符串插值",
    interpolationDesc: "在翻译文本中嵌入动态变量，如用户名、数量等。",
    pluralization: "复数处理",
    pluralizationDesc:
      "根据数量自动选择单复数形式（中文虽无形态变化，但可演示机制）。",
    nestedKey: "嵌套 key",
    nestedKeyDesc: "翻译资源支持多层嵌套结构，便于组织大型项目的文案。",
    namespace: "命名空间",
    namespaceDesc: "将翻译资源按模块拆分，支持按需加载。",
    richText: "HTML 标签嵌入",
    richTextDesc:
      "使用 Trans 组件在翻译文本中嵌入带样式的 HTML 元素或自定义 React 组件。",
  },
} as const;
