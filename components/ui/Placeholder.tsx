type PlaceholderProps = {
  label?: string;
};

export function Placeholder({ label = "Placeholder" }: PlaceholderProps) {
  return <div className="text-sm text-primary/60">{label}</div>;
}
