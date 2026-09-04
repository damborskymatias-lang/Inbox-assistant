import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { DigestChannel, DigestPreferences, PlainDigestPreferences } from '@lov/productivity.entities.daily-digest';

const GET_NOTIFICATION_PREFERENCES = gql`
  query GetNotificationPreferences {
    getNotificationPreferences {
      enabled
      channel
      timeOfDay
    }
  }
`;

const UPDATE_NOTIFICATION_PREFERENCES = gql`
  mutation UpdateNotificationPreferences($enabled: Boolean, $channel: String, $timeOfDay: String) {
    updateNotificationPreferences(options: { enabled: $enabled, channel: $channel, timeOfDay: $timeOfDay }) {
      enabled
      channel
      timeOfDay
    }
  }
`;

export type UpdateDigestPreferencesInput = {
  /**
   * whether the daily digest notification should be enabled.
   */
  enabled?: boolean;

  /**
   * channel used to deliver the digest.
   */
  channel?: DigestChannel;

  /**
   * time of day (HH:mm, 24h) the digest is sent.
   */
  timeOfDay?: string;
};

type UpdateNotificationPreferencesVariables = {
  enabled?: boolean;
  channel?: string;
  timeOfDay?: string;
};

export type UseDigestPreferencesOptions = {
  /**
   * provide mock preferences to skip the network request, useful for
   * compositions and tests.
   */
  mockData?: PlainDigestPreferences;
};

export type UseDigestPreferencesResult = {
  /**
   * the current notification preferences, or undefined while loading.
   */
  preferences?: DigestPreferences;

  /**
   * whether the preferences are currently being fetched.
   */
  loading: boolean;

  /**
   * error message, if the preferences could not be fetched.
   */
  error?: string;

  /**
   * whether an update is currently in flight.
   */
  updating: boolean;

  /**
   * error message, if the last update failed.
   */
  updateError?: string;

  /**
   * update one or more notification preference fields.
   */
  updatePreferences: (input: UpdateDigestPreferencesInput) => Promise<DigestPreferences | undefined>;
};

/**
 * reads the user's daily digest notification preferences and provides a
 * function to update them.
 */
export function useDigestPreferences(options?: UseDigestPreferencesOptions): UseDigestPreferencesResult {
  const { data, loading, error } = useQuery<{ getNotificationPreferences: PlainDigestPreferences | null }>(
    GET_NOTIFICATION_PREFERENCES,
    { skip: Boolean(options?.mockData) }
  );

  const [updateMutation, { loading: updating, error: updateError }] = useMutation<
    { updateNotificationPreferences: PlainDigestPreferences },
    UpdateNotificationPreferencesVariables
  >(UPDATE_NOTIFICATION_PREFERENCES);

  const updatePreferences = async (input: UpdateDigestPreferencesInput) => {
    const result = await updateMutation({ variables: input });
    const updated = result.data?.updateNotificationPreferences;
    return updated ? DigestPreferences.from(updated) : undefined;
  };

  if (options?.mockData) {
    const mockPreferences = options.mockData;
    return {
      preferences: DigestPreferences.from(mockPreferences),
      loading: false,
      error: undefined,
      updating: false,
      updateError: undefined,
      updatePreferences: async (input: UpdateDigestPreferencesInput) =>
        DigestPreferences.from({ ...mockPreferences, ...input }),
    };
  }

  const preferences = data?.getNotificationPreferences
    ? DigestPreferences.from(data.getNotificationPreferences)
    : undefined;

  return {
    preferences,
    loading,
    error: error?.message,
    updating,
    updateError: updateError?.message,
    updatePreferences,
  };
}
