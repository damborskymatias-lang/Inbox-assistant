import React from 'react';
import { Card } from '@lov/design.content.card';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import styles from './features-section.module.scss';
import { defaultFeatures } from './features-section.mock.js';

import type { FeatureItem } from './feature-item-type.js';

export type FeaturesSectionProps = {
  /**
   * eyebrow label rendered above the section title.
   */
  eyebrow?: string;

  /**
   * headline for the features section.
   */
  title?: string;

  /**
   * supporting subtitle for the features section.
   */
  subtitle?: string;

  /**
   * feature cards rendered in the auto-fit grid.
   */
  features?: FeatureItem[];

  /**
   * class name for the section root element.
   */
  className?: string;

  /**
   * inline style for the section root element.
   */
  style?: React.CSSProperties;
};

/**
 * Homepage feature grid showcasing the AI inbox assistant capabilities.
 */
export function FeaturesSection({
  eyebrow = `Why teams switch`,
  title = `Everything your inbox needed`,
  subtitle = `An AI layer over Gmail that reads, sorts, drafts and cleans up — so you only spend time on what truly matters.`,
  features = defaultFeatures,
  className,
  style,
}: FeaturesSectionProps) {
  return (
    <section className={`${styles.section} ${className || ``}`} style={style}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <Heading level={2} size="lg">
          {title}
        </Heading>
        <Paragraph size="md" tone="soft">
          {subtitle}
        </Paragraph>
      </div>

      <div className={styles.grid}>
        {features.map((feature) => (
          <Card key={feature.title} padding="lg" className={styles.card}>
            <span className={styles.icon}>{feature.icon}</span>
            <Heading level={3} size="sm" className={styles.title}>
              {feature.title}
            </Heading>
            <Paragraph size="sm" tone="soft" className={styles.description}>
              {feature.description}
            </Paragraph>
            {feature.highlight && (
              <div className={styles.highlight}>
                <Paragraph size="sm" weight="medium">
                  {feature.highlight}
                </Paragraph>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
