import { Card } from '@lov/design.content.card';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import styles from './inbox-prototype.module.css';

export type DailySummaryProps = {
  /** Name of the signed-in user. */
  name: string;
  /** Total number of new emails. */
  total: number;
  /** AI generated highlights. */
  highlights: string[];
  /** AI suggested first actions. */
  actions: string[];
};

/**
 * The AI daily summary card shown at the top of the dashboard.
 */
export function DailySummary({ name, total, highlights, actions }: DailySummaryProps) {
  return (
    <Card
      padding="lg"
      title="AI daily summary"
      actions={
        <Button variant="ghost" size="sm" iconStart="✨">
          Regenerate
        </Button>
      }
    >
      <Heading level={2} size="lg">
        Good morning, {name} 👋
      </Heading>
      <Paragraph size="md" tone="soft">
        You have <strong>{total} new emails</strong>. Here is what actually matters.
      </Paragraph>

      <div className={styles.sectionLabel}>Important</div>
      <ul className={styles.bullets}>
        {highlights.map((highlight) => (
          <li key={highlight}>
            <Paragraph size="sm">{highlight}</Paragraph>
          </li>
        ))}
      </ul>

      <div className={styles.sectionLabel}>Suggested first actions</div>
      <ol className={styles.orderedActions}>
        {actions.map((action) => (
          <li key={action}>
            <Paragraph size="sm" weight="medium">
              {action}
            </Paragraph>
          </li>
        ))}
      </ol>
    </Card>
  );
}
