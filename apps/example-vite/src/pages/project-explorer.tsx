import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardHeader,
  ProgressBar,
  Splitter,
  SplitterPanel,
} from "@loica-ui/react";
import type { Project } from "../lib/data";
import { formatDue } from "../lib/format";
import { statusColor } from "../lib/status";

export function ProjectExplorer({
  projects,
}: Readonly<{ projects: Project[] }>): ReactNode {
  const { i18n, t } = useTranslation();
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const project = projects.find((item) => item.id === selectedId);

  return (
    <Card variant="outline">
      <CardHeader>{t("dashboard.explorer")}</CardHeader>
      <Splitter
        aria-label={t("dashboard.explorerLabel")}
        defaultSizes={[34, 66]}
        style={{ height: "15rem" }}
      >
        <SplitterPanel collapsible minSize={20}>
          <ul className="list-unstyled d-flex flex-column gap-1 m-0 p-2">
            {projects.map((item) => (
              <li key={item.id}>
                <Button
                  aria-current={item.id === selectedId ? "true" : undefined}
                  colorScheme={item.id === selectedId ? "primary" : undefined}
                  className="w-100 justify-content-start"
                  onClick={() => setSelectedId(item.id)}
                  size="sm"
                  variant={item.id === selectedId ? "solid" : "ghost"}
                >
                  {item.name}
                </Button>
              </li>
            ))}
          </ul>
        </SplitterPanel>
        <SplitterPanel minSize={40}>
          {project ? (
            <div className="d-flex flex-column gap-3 p-3">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="fw-semibold">{project.name}</span>
                <Badge
                  colorScheme={statusColor[project.status]}
                  dot
                  variant="subtle"
                >
                  {t(`status.${project.status}`)}
                </Badge>
              </div>
              <span className="small text-body-secondary">
                {t("dashboard.due", {
                  date: formatDue(project.due, i18n.language),
                })}
              </span>
              <ProgressBar
                aria-label={t("dashboard.progressOf", { name: project.name })}
                colorScheme={statusColor[project.status]}
                showValue
                value={project.progress}
              />
              <AvatarGroup max={4} size="sm">
                {project.team.map((member) => (
                  <Avatar key={member} name={member} />
                ))}
              </AvatarGroup>
            </div>
          ) : null}
        </SplitterPanel>
      </Splitter>
    </Card>
  );
}
