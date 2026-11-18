import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
  CommandPalette,
  CommandPaletteGroup,
  CommandPaletteItem,
  useTheme,
} from "@loica-ui/react";
import { languages, type Language } from "../i18n";
import { usePreferences } from "../providers";
import { brands, type BrandId } from "../theme";
import { DashboardIcon, MoonIcon, ProjectsIcon, SunIcon } from "./icons";

const pages = [
  { href: "/", icon: <DashboardIcon />, label: "nav.dashboard" },
  { href: "/projects", icon: <ProjectsIcon />, label: "nav.projects" },
] as const;

export function CommandMenu({
  onOpenChange,
  open,
}: Readonly<{
  onOpenChange: (open: boolean) => void;
  open: boolean;
}>): ReactNode {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { colorMode, setColorMode } = useTheme();
  const { setBrand, setColorModeSetting } = usePreferences();

  const toggleColorMode = (): void => {
    const next = colorMode === "dark" ? "light" : "dark";
    setColorMode(next);
    setColorModeSetting(next);
  };

  return (
    <CommandPalette onOpenChange={onOpenChange} open={open}>
      <CommandPaletteGroup heading={t("commands.goTo")}>
        {pages.map((page) => (
          <CommandPaletteItem
            icon={page.icon}
            key={page.href}
            onSelect={() => void navigate(page.href)}
          >
            {t(page.label)}
          </CommandPaletteItem>
        ))}
      </CommandPaletteGroup>
      <CommandPaletteGroup heading={t("commands.preferences")}>
        <CommandPaletteItem
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          keywords={["theme", "dark", "light", "tema", "oscuro", "claro"]}
          onSelect={toggleColorMode}
        >
          {colorMode === "dark"
            ? t("preferences.switchToLight")
            : t("preferences.switchToDark")}
        </CommandPaletteItem>
        {languages.map((id) => (
          <CommandPaletteItem
            disabled={id === (i18n.language as Language)}
            key={id}
            keywords={["language", "idioma"]}
            onSelect={() => void i18n.changeLanguage(id)}
          >
            {t(`languages.${id}`)}
          </CommandPaletteItem>
        ))}
        {(Object.keys(brands) as BrandId[]).map((id) => (
          <CommandPaletteItem
            key={id}
            keywords={["brand", "color", "marca"]}
            onSelect={() => setBrand(id)}
          >
            {t("preferences.brandColor")}: {t(`brands.${id}`)}
          </CommandPaletteItem>
        ))}
      </CommandPaletteGroup>
    </CommandPalette>
  );
}
