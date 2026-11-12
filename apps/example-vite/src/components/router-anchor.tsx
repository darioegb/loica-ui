import { forwardRef } from "react";
import { Link as RouterLink } from "react-router";
import type { LinkComponentProps } from "@loica-ui/react";

export const RouterAnchor = forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ href, ...rest }, ref) => <RouterLink {...rest} ref={ref} to={href} />,
);

RouterAnchor.displayName = "RouterAnchor";
