import { useNavigate } from 'react-router-dom';
import { Card } from '@lov/design.content.card';
import { Logo } from '@lov/design.content.logo';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import styles from './inbox-prototype.module.css';

/**
 * Google sign-in landing screen for the AI inbox assistant.
 */
export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.loginScreen}>
      <Card padding="lg" className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <Logo size="lg" showWordmark={false} />
        </div>
        <Heading level={1} size="lg">
          Process your inbox in minutes
        </Heading>
        <Paragraph size="sm" tone="soft">
          AI triages, summarizes and drafts replies. Save 15–30 minutes every day.
        </Paragraph>

        <div className={styles.loginActions}>
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/dashboard')}>
            Continue with Google
          </Button>
          <Paragraph size="xs" tone="muted">
            Read-only access to triage, plus permission to send replies you approve.
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
