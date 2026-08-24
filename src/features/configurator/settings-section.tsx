import type { ReactNode } from "react";

interface SettingsSectionProps {
  children: ReactNode;
  headingId: string;
  title: string;
}

export const SettingsSection = ({
  children,
  headingId,
  title,
}: SettingsSectionProps) => (
  <section
    aria-labelledby={headingId}
    className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0"
  >
    <h2 className="font-semibold text-sm" id={headingId}>
      {title}
    </h2>
    {children}
  </section>
);
