import type { ReactNode } from "react";
import { Heading, Stack, Text } from "@loica-ui/react";

export function PageHeader({
  description,
  title,
}: Readonly<{ description: string; title: string }>): ReactNode {
  return (
    <Stack as="header" gap={1}>
      <Heading level={1} size={3}>
        {title}
      </Heading>
      <Text muted>{description}</Text>
    </Stack>
  );
}
