import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import type { TFunction } from "i18next";
import { Trans, useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Code,
  Collapse,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Divider,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Field,
  Kbd,
  List,
  ListItem,
  ListItemText,
  Loader,
  ProgressBar,
  Rating,
  RichTextEditor,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Timeline,
  TimelineItem,
} from "@loica-ui/react";
import type { Project } from "../lib/data";
import { formatAgo, formatDue } from "../lib/format";
import { statusColor } from "../lib/status";
import { read, write } from "../lib/storage";

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

const milestones = [
  { key: "kickoff", reached: 10 },
  { key: "review", reached: 50 },
  { key: "launch", reached: 100 },
] as const;

function ProjectHealth({ id }: Readonly<{ id: string }>): ReactNode {
  const { t } = useTranslation();
  const key = `loica-demo-health-${id}`;
  const [score, setScore] = useState(() => Number(read(key) ?? 0));
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const change = (next: number): void => {
    setScore(next);
    setSaving(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      write(key, String(next));
      setSaving(false);
    }, 700);
  };

  return (
    <Field
      helperText={
        saving ? (
          <span className="d-inline-flex align-items-center gap-2">
            <Loader label={t("projectDrawer.saving")} size="sm" />
            <span aria-hidden="true">{t("projectDrawer.saving")}</span>
          </span>
        ) : (
          t("projectDrawer.healthHelper")
        )
      }
      label={t("projectDrawer.health")}
    >
      <Rating clearable onValueChange={change} value={score} />
    </Field>
  );
}

function ProjectMilestones({
  project,
}: Readonly<{ project: Project }>): ReactNode {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div>
      <Button
        aria-controls={id}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        size="sm"
        variant="ghost"
      >
        {open
          ? t("projectDrawer.hideMilestones")
          : t("projectDrawer.showMilestones")}
      </Button>
      <Collapse id={id} open={open}>
        <List
          aria-label={t("projectDrawer.milestones")}
          className="mt-2"
          variant="bordered"
        >
          {milestones.map((milestone) => (
            <ListItem key={milestone.key}>
              <ListItemText
                primary={t(`projectDrawer.milestone.${milestone.key}`)}
                secondary={t(
                  project.progress >= milestone.reached
                    ? "projectDrawer.reached"
                    : "projectDrawer.upcoming",
                )}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </div>
  );
}

function ProjectNotes({ id }: Readonly<{ id: string }>): ReactNode {
  const { t } = useTranslation();
  const key = `loica-demo-notes-${id}`;

  return (
    <div className="py-3">
      <RichTextEditor
        aria-label={t("projectDrawer.notesLabel")}
        defaultValue={read(key) ?? ""}
        onValueChange={(html) => write(key, html)}
      />
    </div>
  );
}

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
                  <Tab label={t("projectDrawer.notes")} />
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
                        {project.budget !== undefined ? (
                          <>
                            <DescriptionTerm>{t("projectDrawer.budget")}</DescriptionTerm>
                            <DescriptionDetails>
                              {new Intl.NumberFormat(i18n.language, {
                                currency: "USD",
                                maximumFractionDigits: 0,
                                style: "currency",
                              }).format(project.budget)}
                            </DescriptionDetails>
                          </>
                        ) : null}
                        {project.priority !== undefined ? (
                          <>
                            <DescriptionTerm>{t("projectDrawer.priority")}</DescriptionTerm>
                            <DescriptionDetails>
                              {t("projectDrawer.priorityValue", { value: project.priority })}
                            </DescriptionDetails>
                          </>
                        ) : null}
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
                      <Divider />
                      <ProjectHealth id={project.id} />
                      <Divider />
                      <ProjectMilestones project={project} />
                    </Stack>
                  </TabPanel>
                  <TabPanel>
                    <Timeline
                      aria-label={t("projectDrawer.activity")}
                      className="py-3"
                    >
                      {activity(project, t, i18n.language).map((event) => (
                        <TimelineItem
                          key={event.text}
                          time={event.when}
                          title={event.text}
                        />
                      ))}
                    </Timeline>
                  </TabPanel>
                  <TabPanel>
                    <ProjectNotes id={project.id} />
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
