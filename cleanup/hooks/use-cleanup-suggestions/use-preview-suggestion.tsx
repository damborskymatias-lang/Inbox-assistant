import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';

/**
 * Plain representation of a cleanup preview, listing the emails that would be
 * affected by a suggestion before it is executed.
 */
export type PlainCleanupPreview = {
  /**
   * identifiers of the emails that would be affected.
   */
  emailIds: string[];

  /**
   * number of emails that would be affected.
   */
  count: number;
};

/**
 * GraphQL query previewing the emails affected by a cleanup suggestion,
 * without applying the action.
 */
export const PREVIEW_SUGGESTION_QUERY = gql`
  query PreviewSuggestion($id: String) {
    previewSuggestion(options: { id: $id }) {
      emailIds
      count
    }
  }
`;

export type UsePreviewSuggestionValue = {
  /**
   * fetches a preview of the emails affected by the given suggestion id.
   */
  previewSuggestion: (id: string) => Promise<PlainCleanupPreview | undefined>;

  /**
   * the last resolved preview, if any.
   */
  preview?: PlainCleanupPreview;

  /**
   * whether the preview request is in flight.
   */
  loading: boolean;

  /**
   * error raised while fetching the preview.
   */
  error?: Error;
};

/**
 * previews the emails a cleanup suggestion would affect before it is
 * executed, so the caller can show the user what will be archived or
 * deleted.
 */
export function usePreviewSuggestion(): UsePreviewSuggestionValue {
  const [fetchPreview, { data, loading, error }] = useLazyQuery<{
    previewSuggestion: PlainCleanupPreview | null;
  }>(PREVIEW_SUGGESTION_QUERY);

  const previewSuggestion = async (id: string): Promise<PlainCleanupPreview | undefined> => {
    const result = await fetchPreview({ variables: { id } });
    const preview = result.data?.previewSuggestion;

    return preview
      ? {
          emailIds: preview.emailIds || [],
          count: preview.count,
        }
      : undefined;
  };

  const preview = data?.previewSuggestion
    ? {
        emailIds: data.previewSuggestion.emailIds || [],
        count: data.previewSuggestion.count,
      }
    : undefined;

  return { previewSuggestion, preview, loading, error };
}
