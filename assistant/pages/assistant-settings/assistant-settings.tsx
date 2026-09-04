import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ProtectedRoute, type ProtectedRouteProps } from '@lov/inbox-platform.ui.protected-route';
import { PageLayout } from '@lov/design.layouts.page-layout';
import { Card } from '@lov/design.content.card';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import { SelectList, type SelectOption } from '@lov/design.inputs.select-list';
import { TextInput } from '@lov/design.inputs.text-input';
import { StyleIcon, SparklesIcon } from '@lov/assistant.icons.assistant-icons';
import { useWritingStyle } from '@lov/assistant.hooks.use-reply-draft';
import { DEFAULT_WRITING_STYLE } from '@lov/assistant.entities.reply-draft';
import type { PlainWritingStyle, ReplyTone, ReplyLength } from '@lov/assistant.entities.reply-draft';
import styles from './assistant-settings.module.scss';

const TONE_OPTIONS: SelectOption[] = [
  { value: `friendly`, label: `Friendly` },
  { value: `formal`, label: `Professional` },
  { value: `concise`, label: `Concise` },
  { value: `warm`, label: `Warm` },
];

const LENGTH_OPTIONS: SelectOption[] = [
  { value: `short`, label: `Short` },
  { value: `medium`, label: `Medium` },
  { value: `long`, label: `Long` },
];

const TONE_INTROS: Record<ReplyTone, string> = {
  friendly: `Thanks so much for reaching out! I really appreciate you looping me in.`,
  formal: `Thank you for your message. I appreciate you bringing this to my attention.`,
  concise: `Thanks for the note.`,
  warm: `It's always lovely to hear from you — thank you for thinking of me.`,
};

const LENGTH_EXTRAS: Record<ReplyLength, string[]> = {
  short: [],
  medium: [`I'll have the project update ready for you by tomorrow morning.`],
  long: [
    `I'll have the project update ready for you by tomorrow morning.`,
    `In the meantime, please let me know if there's anything else you need from my end, and I'll make sure to prioritize it.`,
  ],
};

/**
 * builds a sample generated reply reflecting the selected tone, length and sign-off,
 * so users can preview the effect of their writing style before saving it.
 */
function buildPreviewReply(tone: ReplyTone, length: ReplyLength, signOff: string): string {
  const intro = TONE_INTROS[tone];
  const extras = LENGTH_EXTRAS[length];
  const body = [intro, ...extras].join(` `);
  const signature = signOff || DEFAULT_WRITING_STYLE.signOff;

  return `Hi John,\n\n${body}\n\n${signature}`;
}

export type AssistantSettingsProps = {
  /**
   * whether the signed-in user is on the Pro plan. personalized writing style
   * preferences can only be saved by Pro users; Free users can still explore
   * the options and preview, but saving prompts an upgrade.
   */
  isPro?: boolean;

  /**
   * destination the upgrade call-to-action links to.
   */
  upgradeHref?: string;

  /**
   * path anonymous visitors are redirected to.
   */
  redirectTo?: string;

  /**
   * mock user bypassing the auth network request, useful for tests and compositions.
   */
  mockUser?: ProtectedRouteProps['mockUser'];

  /**
   * mock writing style data bypassing the network request, useful for tests and compositions.
   */
  mockWritingStyle?: PlainWritingStyle;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style property for spacing and positioning overrides.
   */
  style?: React.CSSProperties;
};

/**
 * Protected settings page for personalizing the AI's writing style: tone, reply length
 * and sign-off, with a live preview of a sample generated reply. Personalized writing
 * style is a Pro capability — Free users can still edit the defaults and preview the
 * result, but saving surfaces an upgrade prompt.
 */
export function AssistantSettings({
  isPro = false,
  upgradeHref = `/billing`,
  redirectTo = `/login`,
  mockUser,
  mockWritingStyle,
  className,
  style,
}: AssistantSettingsProps) {
  const { writingStyle, loading, updating, updateWritingStyle } = useWritingStyle({
    mockData: mockWritingStyle,
  });

  const [tone, setTone] = useState<ReplyTone>(writingStyle.tone);
  const [length, setLength] = useState<ReplyLength>(writingStyle.length);
  const [signOff, setSignOff] = useState<string>(writingStyle.signOff);
  const [saved, setSaved] = useState(false);
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (loading || hasSyncedRef.current) return;
    hasSyncedRef.current = true;
    setTone(writingStyle.tone);
    setLength(writingStyle.length);
    setSignOff(writingStyle.signOff);
  }, [loading, writingStyle.tone, writingStyle.length, writingStyle.signOff]);

  const handleToneChange = (value: string) => {
    setTone(value as ReplyTone);
    setSaved(false);
  };

  const handleLengthChange = (value: string) => {
    setLength(value as ReplyLength);
    setSaved(false);
  };

  const handleSignOffChange = (value: string) => {
    setSignOff(value);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!isPro) return;
    setSaved(false);
    await updateWritingStyle({ tone, length, signOff });
    setSaved(true);
  };

  const previewBody = buildPreviewReply(tone, length, signOff);

  return (
    <ProtectedRoute mockUser={mockUser} redirectTo={redirectTo}>
      <div className={classNames(styles.assistantSettings, className)} style={style}>
        <PageLayout
          title="Assistant settings"
          subtitle="Personalize how the assistant writes replies on your behalf."
        >
          {!isPro && (
            <Card tone="brand" className={styles.upgradeCard}>
              <div className={styles.upgradeRow}>
                <div className={styles.upgradeText}>
                  <Paragraph size="md" weight="semiBold">
                    Personalized writing style is a Pro capability
                  </Paragraph>
                  <Paragraph size="sm" tone="soft">
                    Upgrade to Pro to save your tone, length and sign-off preferences. You can
                    still explore the options and preview below using the default style.
                  </Paragraph>
                </div>
                <Button variant="primary" href={upgradeHref}>
                  Upgrade to Pro
                </Button>
              </div>
            </Card>
          )}

          <div className={styles.grid}>
            <Card title="Writing style" padding="lg" className={styles.formCard}>
              <div className={styles.field}>
                <SelectList
                  label="Tone"
                  options={TONE_OPTIONS}
                  value={tone}
                  onChange={(value) => handleToneChange(value)}
                />
              </div>
              <div className={styles.field}>
                <SelectList
                  label="Reply length"
                  options={LENGTH_OPTIONS}
                  value={length}
                  onChange={(value) => handleLengthChange(value)}
                />
              </div>
              <div className={styles.field}>
                <TextInput
                  label="Sign-off"
                  value={signOff}
                  onChange={(value) => handleSignOffChange(value)}
                  placeholder="Best, Peter"
                  helperText="Added to the end of every generated reply."
                />
              </div>
              <div className={styles.actions}>
                <Button
                  variant="primary"
                  iconStart={<StyleIcon size="sm" />}
                  disabled={!isPro}
                  loading={updating}
                  onClick={() => handleSave()}
                >
                  Save changes
                </Button>
                {!isPro && (
                  <Paragraph size="xs" tone="muted">
                    Saving requires a Pro plan.
                  </Paragraph>
                )}
                {isPro && saved && !updating && (
                  <Paragraph size="xs" tone="success" weight="medium">
                    Saved — new replies will use this style.
                  </Paragraph>
                )}
              </div>
            </Card>

            <Card title="Live preview" padding="lg" className={styles.previewCard}>
              <div className={styles.previewHead}>
                <SparklesIcon size="sm" color="primary" />
                <Paragraph size="sm" tone="soft" weight="medium">
                  Sample generated reply
                </Paragraph>
              </div>
              <div className={styles.previewBody}>
                <Paragraph size="sm">{previewBody}</Paragraph>
              </div>
            </Card>
          </div>
        </PageLayout>
      </div>
    </ProtectedRoute>
  );
}
