import type React from "react";
import type { RouteProps } from "react-router-dom";

export namespace TypeRoute {
  export interface Route extends Omit<RouteProps, "children" | "element"> {
    hide?: boolean;
    title?: string;
    children?: Route[];
    icon?: React.ReactNode;
    element: React.LazyExoticComponent<React.ComponentType>;
  }
}
