import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Card } from '@lov/design.content.card';
import { Logo } from '@lov/design.content.logo';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import { TextInput } from '@lov/design.inputs.text-input';
import { GoogleIcon, ChevronDownIcon } from '@lov/inbox-platform.icons.inbox-icons';
import { useAuth } from '@lov/inbox-platform.hooks.use-auth';
import type { User } from '@lov/inbox-platform.entities.user';
import styles from './login.module.scss';

export type LoginProps = {
  /**
   * route the visitor is redirected to after a successful sign-in.
   */
  redirectPath?: string;

  /**
   * email prefilled in the demo sign-in form.
   */
  demoEmail?: string;

  /**
   * password prefilled in the demo sign-in form.
   */
  demoPassword?: string;

  /**
   * mock user used to bypass network requests, useful for compositions and tests.
   */
  mockUser?: User;

  /**
   * class name to override the root container.
   */
  className?: string;

  /**
   * style to override the root container.
   */
  style?: React.CSSProperties;
};

const DEFAULT_DEMO_EMAIL = `peter@demo.inbox`;
const DEFAULT_DEMO_PASSWORD = `demo1234`;

/**
 * Sign-in page offering Google OAuth as the primary path and a collapsible
 * demo email/password form prefilled with the seeded demo account.
 */
export function Login({
  redirectPath = `/dashboard`,
  demoEmail = DEFAULT_DEMO_EMAIL,
  demoPassword = DEFAULT_DEMO_PASSWORD,
  mockUser,
  className,
  style,
}: LoginProps) {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithPassword } = useAuth({ mockData: mockUser });

  const [showDemoForm, setShowDemoForm] = useState(false);
  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState(demoPassword);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [formError, setFormError] = useState(``);

  async function handleGoogleLogin() {
    setFormError(``);
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      navigate(redirectPath);
    } catch {
      setFormError(`We could not sign you in with Google. Please try again.`);
    } finally {
      setGoogleSubmitting(false);
    }
  }

  async function handleDemoSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(``);
    setDemoSubmitting(true);
    try {
      await loginWithPassword(email, password);
      navigate(redirectPath);
    } catch {
      setFormError(`Invalid email or password. Please check your details and try again.`);
    } finally {
      setDemoSubmitting(false);
    }
  }

  return (
    <div className={classNames(styles.page, className)} style={style}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.logoWrapper}>
          <Logo size="lg" showWordmark={false} />
        </div>
        <Heading level={1} size="lg" className={styles.headline}>
          Process your inbox in minutes
        </Heading>
        <Paragraph size="md" tone="soft" className={styles.subtext}>
          AI triages, summarizes and drafts replies. Save 15–30 minutes every day.
        </Paragraph>

        {formError && (
          <Paragraph size="sm" tone="danger" className={styles.error}>
            {formError}
          </Paragraph>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={googleSubmitting}
          iconStart={<GoogleIcon size="sm" />}
          onClick={() => handleGoogleLogin()}
        >
          Continue with Google
        </Button>

        <Paragraph size="xs" tone="muted" className={styles.permissions}>
          Read-only access to triage, plus permission to send replies you approve.
        </Paragraph>

        <button
          type="button"
          className={styles.demoToggle}
          onClick={() => setShowDemoForm(!showDemoForm)}
        >
          <span>Sign in with a demo account instead</span>
          <ChevronDownIcon
            size="sm"
            className={classNames(styles.demoToggleIcon, showDemoForm && styles.demoToggleIconOpen)}
          />
        </button>

        {showDemoForm && (
          <form className={styles.demoForm} onSubmit={(event) => handleDemoSubmit(event)}>
            <TextInput
              label="Email"
              type="email"
              value={email}
              required
              onChange={(nextValue) => setEmail(nextValue)}
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              required
              onChange={(nextValue) => setPassword(nextValue)}
            />
            <Button
              type="submit"
              variant="secondary"
              size="md"
              fullWidth
              loading={demoSubmitting}
              className={styles.demoSubmit}
            >
              Sign in with demo account
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
