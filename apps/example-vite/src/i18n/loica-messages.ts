import type { TFunction } from "i18next";
import type { LoicaMessages } from "@loica-ui/react";

export function loicaMessages(t: TFunction): LoicaMessages {
  return {
    avatar: {
      away: t("loica.avatar.away"),
      busy: t("loica.avatar.busy"),
      offline: t("loica.avatar.offline"),
      online: t("loica.avatar.online"),
    },
    avatarGroup: {
      overflow: (hidden) => t("loica.avatarGroup.overflow", { hidden }),
    },
    breadcrumb: { breadcrumb: t("loica.breadcrumb.breadcrumb") },
    close: { label: t("loica.close.label") },
    datePicker: {
      apply: t("loica.datePicker.apply"),
      calendar: t("loica.datePicker.calendar"),
      cancel: t("loica.datePicker.cancel"),
      format: (format) => t("loica.datePicker.format", { format }),
      nextMonth: t("loica.datePicker.nextMonth"),
      nextYears: t("loica.datePicker.nextYears"),
      openCalendar: t("loica.datePicker.openCalendar"),
      previousMonth: t("loica.datePicker.previousMonth"),
      previousYears: t("loica.datePicker.previousYears"),
    },
    input: { reveal: t("loica.input.reveal") },
    loader: { label: t("loica.loader.label") },
    navbarToggle: { label: t("loica.navbarToggle.label") },
    paginator: {
      first: t("loica.paginator.first"),
      last: t("loica.paginator.last"),
      next: t("loica.paginator.next"),
      page: (page, current) =>
        t(current ? "loica.paginator.pageCurrent" : "loica.paginator.page", {
          page,
        }),
      pageSize: t("loica.paginator.pageSize"),
      pagination: t("loica.paginator.pagination"),
      previous: t("loica.paginator.previous"),
      summary: (from, to, total) =>
        t("loica.paginator.summary", { from, to, total }),
    },
    select: {
      clear: t("loica.select.clear"),
      empty: t("loica.select.empty"),
      overflow: (hidden) => t("loica.select.overflow", { hidden }),
      remove: (label) => t("loica.select.remove", { label }),
      search: t("loica.select.search"),
    },
    sidebarToggle: { label: t("loica.sidebarToggle.label") },
    textarea: {
      count: (current, max) =>
        max === undefined
          ? t("loica.textarea.count", { current })
          : t("loica.textarea.countMax", { current, max }),
      remaining: (remaining) =>
        t("loica.textarea.remaining", { count: remaining }),
    },
    toast: {
      region: t("loica.toast.region"),
    },
  };
}
