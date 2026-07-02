export interface NavItem {
  slug: string;
  name: string;
  built: boolean;
}

// Mirrors 05-build-order.md — update `built` as components ship.
export const navItems: NavItem[] = [
  { slug: "button", name: "01 — Button", built: true },
  { slug: "toggle", name: "02 — Toggle", built: true },
  { slug: "checkbox", name: "03 — Checkbox", built: true },
  { slug: "input-field", name: "04 — Input field", built: true },
  { slug: "tooltip", name: "05 — Tooltip", built: true },
  { slug: "dropdown", name: "06 — Dropdown", built: false },
  { slug: "tab-switcher", name: "07 — Tab switcher", built: false },
  { slug: "toast", name: "08 — Toast", built: false },
  { slug: "card", name: "09 — Card", built: false },
  { slug: "stat-card", name: "10 — Stat card", built: false },
  { slug: "progress-bar", name: "11 — Progress bar", built: false },
  { slug: "chart-line", name: "12 — Chart, line", built: false },
  { slug: "table-row", name: "13 — Table row", built: false },
  { slug: "sidebar-nav", name: "14 — Sidebar nav", built: false },
  { slug: "modal-drawer", name: "15 — Modal/Drawer", built: false },
];
