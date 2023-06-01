import { useFetch } from "usehooks-ts";

enum TranslationNS {
  Auth = "auth",
  Common = "common",
  Features = "features",
  Hero = "hero",
}

type NSKey = `${TranslationNS}:${string}`;

type TranslationData = Record<string, string>;

type TranslateResult<K> = K extends NSKey ? string: TranslationData;

export function useTranslate<K extends NSKey | `${TranslationNS}`>(
  key: K,
  lang = "en"
): TranslateResult<K> {
  const [ns, id] = key.split(":");
  const { data } = useFetch<TranslationData>(
    `/locales/${lang}/${ns}.json`
  );

  if(!id) return (data ?? {}) as unknown as TranslateResult<K>

  return (data?.[id] ?? key) as unknown as TranslateResult<K>;
}
