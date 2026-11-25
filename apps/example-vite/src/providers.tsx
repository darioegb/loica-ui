import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ConfirmProvider,
  LocaleProvider,
  ThemeProvider,
  ToastProvider,
  type ColorModeSetting,
} from "@loica-ui/react";
import { es } from "@loica-ui/react/locales/es";
import { BootstrapColorMode } from "./components/bootstrap-color-mode";
import { read, write } from "./lib/storage";
import { defaultBrand, isBrand, themeFor, type BrandId } from "./theme";

const BRAND_KEY = "loica-projects:brand";
const COLOR_MODE_KEY = "loica-projects:color-mode";

interface PreferencesContextValue {
  brand: BrandId;
  setBrand: (brand: BrandId) => void;
  setColorModeSetting: (setting: ColorModeSetting) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context)
    throw new Error("usePreferences must be used within <Providers>");
  return context;
}

const isColorMode = (value: string | null): value is ColorModeSetting =>
  value === "light" || value === "dark" || value === "system";

// The app only runs in the browser, so the saved choices are read before the first render.
export function Providers({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  const [brand, setBrandState] = useState<BrandId>(() => {
    const saved = read(BRAND_KEY);
    return isBrand(saved) ? saved : defaultBrand;
  });
  const [colorMode] = useState<ColorModeSetting>(() => {
    const saved = read(COLOR_MODE_KEY);
    return isColorMode(saved) ? saved : "system";
  });
  const { i18n } = useTranslation();
  const theme = useMemo(() => themeFor(brand), [brand]);
  const value = useMemo(
    () => ({
      brand,
      setBrand: (next: BrandId) => {
        setBrandState(next);
        write(BRAND_KEY, next);
      },
      setColorModeSetting: (next: ColorModeSetting) =>
        write(COLOR_MODE_KEY, next),
    }),
    [brand],
  );

  return (
    <PreferencesContext.Provider value={value}>
      <ThemeProvider
        defaultColorMode={colorMode}
        style={{ minHeight: "100vh" }}
        theme={theme}
      >
        <BootstrapColorMode />
        <LocaleProvider
          locale={i18n.language}
          messages={i18n.language === "es" ? es : undefined}
        >
          <ConfirmProvider>
            <ToastProvider>{children}</ToastProvider>
          </ConfirmProvider>
        </LocaleProvider>
      </ThemeProvider>
    </PreferencesContext.Provider>
  );
}
