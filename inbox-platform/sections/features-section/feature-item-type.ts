/**
 * A single feature entry rendered as a card within the features section.
 */
export type FeatureItem = {
  /**
   * emoji or short glyph representing the feature.
   */
  icon: string;

  /**
   * short feature title.
   */
  title: string;

  /**
   * one to two sentence description of the feature.
   */
  description: string;

  /**
   * short highlight stat or tagline rendered at the bottom of the card.
   */
  highlight?: string;
};
