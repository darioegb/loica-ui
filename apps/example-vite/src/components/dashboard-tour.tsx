import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tour, type TourStep } from "@loica-ui/react";

export function DashboardTour(): ReactNode {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const steps: TourStep[] = [
    {
      content: t("dashboard.tour.welcomeContent"),
      title: t("dashboard.tour.welcomeTitle"),
    },
    {
      content: t("dashboard.tour.metricsContent"),
      target: "#dashboard-metrics",
      title: t("dashboard.tour.metricsTitle"),
    },
    {
      content: t("dashboard.tour.projectsContent"),
      target: "#dashboard-projects",
      title: t("dashboard.tour.projectsTitle"),
    },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" variant="outline">
        {t("dashboard.tour.start")}
      </Button>
      <Tour onOpenChange={setOpen} open={open} steps={steps} />
    </>
  );
}
