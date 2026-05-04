# i18next 国际化演示

基于 i18next + react-i18next 的国际化示例，展示核心 i18n 能力。

## 功能展示

| 特性 | 说明 |
|---|---|
| 基础翻译 | `t()` 函数使用、语言切换 |
| 字符串插值 | `{{variable}}` 动态变量嵌入 |
| 复数处理 | `_one` / `_other` 后缀自动选形 |
| 嵌套 key | 多层对象结构组织翻译资源 |
| HTML 标签嵌入 | `Trans` 组件在翻译文本中渲染 `<strong>`、`<a>` 等元素 |
| 语言持久化 | `localStorage` 记住用户选择，下次打开自动恢复 |

## 文件结构

```
src/demos/i18next/
├── index.tsx                  # Demo 组件
├── react-i18next.d.ts         # 类型声明，基于资源对象自动推导 t() 的 key
└── i18n/
    ├── index.ts               # i18n 初始化配置（语言检测、资源注册）
    └── locales/
        ├── zh-CN.ts           # 中文翻译资源
        └── en-US.ts           # 英文翻译资源
```

## 初始化流程

1. 读取 `localStorage` 中保存的语言偏好
2. 若无记录，用 `navigator.language` 做精确匹配 → 前缀匹配
3. 都未命中则回退到 `zh-CN`
4. 将匹配到的语言和全部资源传入 `i18n.init()`
5. 监听 `languageChanged` 事件，自动持久化到 `localStorage`

## Trans 组件注意点

`Trans` 组件不会随语言变化自动重新渲染，需要通过 `key={i18n.language}` 强制刷新：

```tsx
<Trans key={i18n.language} i18nKey="demo.richText" components={{ bold: <strong />, ... }} />
```

翻译文本中使用的组件名不能与 HTML void element 冲突（如 `<link>`、`<img>`），否则子内容不会被渲染。推荐用 `<anchor>` 等非 HTML 名称。
