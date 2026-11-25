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
    colorPicker: {
      alpha: t("loica.colorPicker.alpha"),
      area: t("loica.colorPicker.area"),
      areaValue: (saturation, brightness) =>
        t("loica.colorPicker.areaValue", { brightness, saturation }),
      blue: t("loica.colorPicker.blue"),
      colorPicker: t("loica.colorPicker.colorPicker"),
      eyeDropper: t("loica.colorPicker.eyeDropper"),
      green: t("loica.colorPicker.green"),
      hex: t("loica.colorPicker.hex"),
      hue: t("loica.colorPicker.hue"),
      lightness: t("loica.colorPicker.lightness"),
      openColorPicker: t("loica.colorPicker.openColorPicker"),
      red: t("loica.colorPicker.red"),
      saturation: t("loica.colorPicker.saturation"),
      swatches: t("loica.colorPicker.swatches"),
    },
    commandPalette: {
      empty: t("loica.commandPalette.empty"),
      label: t("loica.commandPalette.label"),
      placeholder: t("loica.commandPalette.placeholder"),
      results: (count) => t("loica.commandPalette.results", { count }),
    },
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
    richTextEditor: {
      editor: t("loica.richTextEditor.editor"),
      toolbar: t("loica.richTextEditor.toolbar"),
      bold: t("loica.richTextEditor.bold"),
      italic: t("loica.richTextEditor.italic"),
      underline: t("loica.richTextEditor.underline"),
      code: t("loica.richTextEditor.code"),
      link: t("loica.richTextEditor.link"),
      linkAddress: t("loica.richTextEditor.linkAddress"),
      applyLink: t("loica.richTextEditor.applyLink"),
      removeLink: t("loica.richTextEditor.removeLink"),
      paragraph: t("loica.richTextEditor.paragraph"),
      heading1: t("loica.richTextEditor.heading1"),
      heading2: t("loica.richTextEditor.heading2"),
      heading3: t("loica.richTextEditor.heading3"),
      quote: t("loica.richTextEditor.quote"),
      codeBlock: t("loica.richTextEditor.codeBlock"),
      bullet: t("loica.richTextEditor.bullet"),
      ordered: t("loica.richTextEditor.ordered"),
      font: t("loica.richTextEditor.font"),
      fontDefault: t("loica.richTextEditor.fontDefault"),
      fontSans: t("loica.richTextEditor.fontSans"),
      fontSerif: t("loica.richTextEditor.fontSerif"),
      fontMono: t("loica.richTextEditor.fontMono"),
      size: t("loica.richTextEditor.size"),
      sizeDefault: t("loica.richTextEditor.sizeDefault"),
      sizeSmall: t("loica.richTextEditor.sizeSmall"),
      sizeLarge: t("loica.richTextEditor.sizeLarge"),
      sizeHuge: t("loica.richTextEditor.sizeHuge"),
      alignStart: t("loica.richTextEditor.alignStart"),
      alignCenter: t("loica.richTextEditor.alignCenter"),
      alignEnd: t("loica.richTextEditor.alignEnd"),
      alignJustify: t("loica.richTextEditor.alignJustify"),
      undo: t("loica.richTextEditor.undo"),
      redo: t("loica.richTextEditor.redo"),
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
    splitter: { resize: () => t("loica.splitter.resize") },
    toast: {
      region: t("loica.toast.region"),
    },
    tour: {
      done: t("loica.tour.done"),
      next: t("loica.tour.next"),
      previous: t("loica.tour.previous"),
      progress: (current, total) => t("loica.tour.progress", { current, total }),
      skip: t("loica.tour.skip"),
    },
  };
}
