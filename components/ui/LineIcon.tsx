import type { SVGProps } from "react";

export type LineIconName =
  | "automation"
  | "brain"
  | "chart"
  | "chat"
  | "compass"
  | "document"
  | "globe"
  | "image"
  | "layers"
  | "lightbulb"
  | "map"
  | "network"
  | "presentation"
  | "route"
  | "shield"
  | "spark"
  | "team";

type LineIconProps = SVGProps<SVGSVGElement> & {
  name: LineIconName;
};

const paths: Record<LineIconName, string[]> = {
  automation: [
    "M8 8h8v8H8z",
    "M12 4v4",
    "M6 12H4m16 0h-2",
    "M8 20h8",
    "M12 16v4",
  ],
  brain: [
    "M9 6a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 5 2.2",
    "M15 6a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-5 2.2",
    "M12 5v14",
    "M8 11h3m2 0h3",
  ],
  chart: ["M5 19V5", "M5 19h14", "M9 16v-5", "M13 16V8", "M17 16v-8"],
  chat: ["M5 6h14v10H9l-4 4V6z", "M8 10h8", "M8 13h5"],
  compass: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M15.5 8.5l-2 5-5 2 2-5 5-2z"],
  document: ["M7 4h7l3 3v13H7z", "M14 4v4h4", "M9 12h6", "M9 15h6"],
  globe: [
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
    "M3 12h18",
    "M12 3c2.3 2.5 3.5 5.5 3.5 9s-1.2 6.5-3.5 9",
    "M12 3c-2.3 2.5-3.5 5.5-3.5 9s1.2 6.5 3.5 9",
  ],
  image: ["M5 5h14v14H5z", "M8 15l3-3 2 2 2-3 3 4", "M9 9h.01"],
  layers: ["M12 4l8 4-8 4-8-4 8-4z", "M4 12l8 4 8-4", "M4 16l8 4 8-4"],
  lightbulb: ["M9 18h6", "M10 21h4", "M8 11a4 4 0 1 1 8 0c0 2-1.2 3-2 4H10c-.8-1-2-2-2-4z"],
  map: ["M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6z", "M9 4v14", "M15 6v14"],
  network: ["M6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", "M18 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", "M12 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", "M7.5 7.5l3.5 8", "M16.5 7.5l-3.5 8", "M8 5h8"],
  presentation: ["M4 5h16v10H4z", "M12 15v5", "M9 20h6", "M8 9h4", "M8 12h8"],
  route: ["M5 6h5a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h10", "M5 6l3-3", "M5 6l3 3", "M19 22l-3-3", "M19 22l-3 3"],
  shield: ["M12 3l7 3v5c0 4.5-2.8 7.6-7 10-4.2-2.4-7-5.5-7-10V6l7-3z"],
  spark: ["M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z", "M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"],
  team: ["M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M17 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M4 20a5 5 0 0 1 10 0", "M12 20a5 5 0 0 1 8 0"],
};

export function LineIcon({ name, className = "", ...props }: LineIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
