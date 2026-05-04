import "@/demos/i18next/i18n";
import { cn } from "@/utils/cn";
import { Trans, useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "zh-CN", label: "中文" },
  { code: "en-US", label: "English" },
] as const;

export const I18nDemo = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentTime = new Date().toLocaleTimeString(
    i18n.language === "zh-CN" ? "zh-CN" : "en-US",
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <span className="inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            i18next
          </span>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("common.welcome")}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            {t("common.description")}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("features.title")}
          </h2>

          <div className="mt-5 space-y-5">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                {t("features.basic")}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t("features.basicDesc")}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {t("common.currentLanguage")}:{" "}
                <span className="font-medium text-gray-900">
                  {i18n.language}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                {t("features.interpolation")}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t("features.interpolationDesc")}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500">
                  {t("demo.greeting", { name: "Nacho" })}
                </p>
                <p className="text-sm text-gray-500">
                  {t("demo.interpolation", { date: currentTime })}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                {t("features.pluralization")}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t("features.pluralizationDesc")}
              </p>
              <div className="mt-2 space-y-1">
                {[0, 1, 5].map((count) => (
                  <p key={count} className="text-sm text-gray-500">
                    count={count}: {t("demo.itemCount", { count })}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                {t("features.nestedKey")}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t("features.nestedKeyDesc")}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {t("demo.nested.example")}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                {t("features.namespace")}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t("features.namespaceDesc")}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                {t("features.richText")}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {t("features.richTextDesc")}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {/* Trans 组件只做插槽处理，并不会随着语言变化而重新渲染，需要通过 key 属性强制更新 */}
                <Trans
                  key={i18n.language}
                  i18nKey="demo.richText"
                  components={{
                    bold: <strong className="font-semibold text-gray-800" />,
                    anchor: (
                      <a
                        href="https://react.i18next.com/latest/trans-component"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-700"
                      />
                    ),
                  }}
                />
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("common.changeLanguage")}
            </h2>
            <div className="mt-4 flex flex-col gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    "h-11 rounded-xl border px-4 text-sm font-medium transition-colors",
                    i18n.language === lang.code
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600",
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              i18n 实现说明
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
              <li>使用 i18next + react-i18next 实现国际化。</li>
              <li>翻译资源按 demo 目录独立管理，支持类型安全的 key 提示。</li>
              <li>支持字符串插值、复数处理、嵌套 key 等核心特性。</li>
              <li>
                当前语言:{" "}
                <span className="font-medium text-gray-900">
                  {i18n.language}
                </span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};
