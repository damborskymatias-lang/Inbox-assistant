import { useCallback, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { WritingStyle, type PlainWritingStyle } from '@lov/assistant.entities.reply-draft';

/**
 * query used to read the current user's writing style preferences.
 */
export const GET_WRITING_STYLE_QUERY = gql`
  query GetWritingStyle {
    getWritingStyle {
      tone
      length
      signOff
    }
  }
`;

/**
 * mutation used to update the current user's writing style preferences.
 */
export const UPDATE_WRITING_STYLE_MUTATION = gql`
  mutation UpdateWritingStyle($options: UpdateWritingStyleOptions) {
    updateWritingStyle(options: $options) {
      tone
      length
      signOff
    }
  }
`;

type GetWritingStyleQueryResult = {
  getWritingStyle: PlainWritingStyle;
};

type UpdateWritingStyleMutationResult = {
  updateWritingStyle: PlainWritingStyle;
};

/**
 * partial writing style preferences accepted by updateWritingStyle. any
 * field left out keeps its previously saved value.
 */
export type UpdateWritingStyleOptions = Partial<PlainWritingStyle>;

export type UseWritingStyleOptions = {
  /**
   * mock writing style data, bypassing the network request. useful for
   * compositions and tests.
   */
  mockData?: PlainWritingStyle;
};

export type UseWritingStyleValue = {
  /**
   * the current writing style, falling back to the default style while
   * loading or when no preferences have been saved yet.
   */
  writingStyle: WritingStyle;

  /**
   * whether the writing style is being loaded.
   */
  loading: boolean;

  /**
   * error message raised while loading the writing style, if any.
   */
  error?: string;

  /**
   * whether an update request is in flight.
   */
  updating: boolean;

  /**
   * error message raised while updating the writing style, if any.
   */
  updateError?: string;

  /**
   * update one or more writing style preferences.
   */
  updateWritingStyle: (options: UpdateWritingStyleOptions) => Promise<void>;
};

/**
 * useWritingStyle reads the user's writing style preferences (tone, length
 * and sign-off) used to personalize AI generated replies, and exposes a
 * function to update them.
 */
export function useWritingStyle(options?: UseWritingStyleOptions): UseWritingStyleValue {
  const mockData = options?.mockData;
  const [updatedStyle, setUpdatedStyle] = useState<PlainWritingStyle | undefined>(undefined);

  const { data, loading, error } = useQuery<GetWritingStyleQueryResult>(GET_WRITING_STYLE_QUERY, {
    skip: Boolean(mockData),
  });

  const [updateWritingStyleMutation, { loading: updating, error: updateMutationError }] =
    useMutation<UpdateWritingStyleMutationResult>(UPDATE_WRITING_STYLE_MUTATION, {
      update(cache, mutationResult) {
        const newStyle = mutationResult.data?.updateWritingStyle;
        if (!newStyle) {
          return;
        }

        cache.writeQuery({
          query: GET_WRITING_STYLE_QUERY,
          data: { getWritingStyle: newStyle },
        });
      },
    });

  const plainWritingStyle = mockData || updatedStyle || data?.getWritingStyle;
  const writingStyle = plainWritingStyle ? WritingStyle.from(plainWritingStyle) : WritingStyle.default();

  const updateWritingStyle = useCallback(
    async (updateOptions: UpdateWritingStyleOptions) => {
      const response = await updateWritingStyleMutation({ variables: { options: updateOptions } });
      const newStyle = response.data?.updateWritingStyle;
      if (newStyle) {
        setUpdatedStyle(newStyle);
      }
    },
    [updateWritingStyleMutation]
  );

  return {
    writingStyle,
    loading: mockData ? false : loading,
    error: mockData ? undefined : error?.message,
    updating,
    updateError: updateMutationError?.message,
    updateWritingStyle,
  };
}
