import { Button } from "../atoms/Button";
import { KeyValue } from "../molecules/KeyValue";
import { PageHeader } from "../molecules/PageHeader";
import { Panel } from "../molecules/Panel";
import type { RoleProfileData } from "@/lib/data/roleProfile";
import shell from "@/styles/shell.module.css";

export interface RoleProfileViewProps {
  data: RoleProfileData;
}

export function RoleProfileView({ data }: RoleProfileViewProps) {
  return (
    <main id="content" className={shell.page}>
      <PageHeader href={data.href} title={data.title} lead={data.lead} />
      <div className={shell.split}>
        <div className={shell.stack}>
          <Panel title={data.primaryPanel.title}>
            <KeyValue items={data.primaryPanel.items} />
          </Panel>
        </div>
        <div className={shell.stack}>
          <Panel title={data.secondaryPanel.title}>
            <KeyValue items={data.secondaryPanel.items} />
            {data.secondaryPanel.action && (
              <Button href={data.secondaryPanel.action.href} variant="ghost" size="sm">
                {data.secondaryPanel.action.label}
              </Button>
            )}
          </Panel>
        </div>
      </div>
    </main>
  );
}
