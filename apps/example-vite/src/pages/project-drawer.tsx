import type { ReactNode } from "react";
import type { TFunction } from "i18next";
import { Trans, useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Code,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Kbd,
  ProgressBar,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@loica-ui/react";
import type { Project } from "../lib/data";
import { formatAgo, formatDue } from "../lib/format";
import { statusColor } from "../lib/status";

const activity = (
  project: Project,
  t: TFunction,
  language: string,
): { text: string; when: string }[] => [
  {
    text: t("projectDrawer.updatedPlan", { name: project.owner }),
    when: formatAgo(2, "day", language),
  },
  {
    text: t("projectDrawer.commented", {
      name: project.team[1] ?? project.owner,
    }),
    when: formatAgo(4, "day", language),
  },
  {
    text: t("projectDrawer.createdProject", { name: project.owner }),
    when: formatAgo(3, "week", language),
  },
];

export function ProjectDrawer({
  onComplete,
  onOpenChange,
  onRemove,
  open,
  project,
}: Readonly<{
  onComplete: (project: Project) => void;
  onOpenChange: (open: boolean) => void;
  onRemove: (project: Project) => void;
  open: boolean;
  project: Project | null;
}>): ReactNode {
  const { i18n, t } = useTranslation();

  return (
    <Drawer onOpenChange={onOpenChange} open={open && project !== null}>
      <DrawerContent>
        {project ? (
          <>
            <DrawerHeader>{project.name}</DrawerHeader>
            <DrawerBody>
              <Tabs>
                <TabList>
                  <Tab label={t("projectDrawer.overview")} />
                  <Tab label={t("projectDrawer.activity")} />
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Stack className="py-3" gap={3}>
                      <p className="mb-0">
                        {project.description || t("projectDrawer.noDescription")}
                      </p>
                      <DescriptionList layout="inline">
                        <DescriptionTerm>{t("projectDrawer.id")}</DescriptionTerm>
                        <DescriptionDetails>
                          <Code size="sm">{project.id}</Code>
                        </DescriptionDetails>
                        <DescriptionTerm>{t("projectDrawer.status")}</DescriptionTerm>
                        <DescriptionDetails>
                          <Badge
                            colorScheme={statusColor[project.status]}
                            dot
                            variant="subtle"
                          >
                            {t(`status.${project.status}`)}
                          </Badge>
                        </DescriptionDetails>
                        <DescriptionTerm>{t("projectDrawer.due")}</DescriptionTerm>
                        <DescriptionDetails>{formatDue(project.due, i18n.language)}</DescriptionDetails>
                        <DescriptionTerm>{t("projectDrawer.owner")}</DescriptionTerm>
                        <DescriptionDetails className="d-flex align-items-center gap-2 small text-body-secondary">
                          <Avatar name={project.owner} size="sm" />
                          {project.owner}
                        </DescriptionDetails>
                        <DescriptionTerm>{t("projectDrawer.team")}</DescriptionTerm>
                        <DescriptionDetails>
                          <AvatarGroup max={5} size="sm">
                            {project.team.map((member) => (
                              <Avatar key={member} name={member} />
                            ))}
                          </AvatarGroup>
                        </DescriptionDetails>
                        <DescriptionTerm>{t("projectDrawer.visibility")}</DescriptionTerm>
                        <DescriptionDetails>
                          <Badge colorScheme="salmon" variant="subtle">
                            {t(`visibility.${project.visibility}`)}
                          </Badge>
                        </DescriptionDetails>
                      </DescriptionList>
                      <ProgressBar
                        aria-label={t("projectDrawer.progress")}
                        colorScheme={statusColor[project.status]}
                        showValue
                        value={project.progress}
                      />
                    </Stack>
                  </TabPanel>
                  <TabPanel>
                    <ul className="list-group list-group-flush py-3">
                      {activity(project, t, i18n.language).map((event) => (
                        <li
                          className="list-group-item bg-transparent px-0"
                          key={event.text}
                        >
                          {event.text}
                          <span className="d-block small text-body-secondary">
                            {event.when}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </DrawerBody>
            <DrawerFooter>
              <p className="small text-body-secondary mb-0 me-auto">
                <Trans
                  components={{ kbd: <Kbd size="sm" /> }}
                  i18nKey="projectDrawer.closeHint"
                />
              </p>
              <Button
                colorScheme="error"
                onClick={() => onRemove(project)}
                variant="ghost"
              >
                {t("projectDrawer.delete")}
              </Button>
              <DrawerClose>
                <Button
                  disabled={project.status === "Done"}
                  onClick={() => onComplete(project)}
                  variant="outline"
                >
                  {t("projectDrawer.markDone")}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
