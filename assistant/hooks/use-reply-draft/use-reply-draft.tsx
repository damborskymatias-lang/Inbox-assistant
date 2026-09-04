import { useCallback, useRef, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { ReplyDraft, type PlainReplyDraft } from '@lov/assistant.entities.reply-draft';

/**
 * mutation used to generate (or regenerate) an AI reply draft for an email.
 */
export const GENERATE_REPLY_MUTATION = gql`
  mutation GenerateReply($options: GenerateReplyOptions) {
    generateReply(options: $options) {
      id
      emailId
      body
      tone
      generatedAt
    }
  }
`;

type GenerateReplyMutationResult = {
  generateReply: PlainReplyDraft;
};

/**
 * error surfaced by the useReplyDraft hook. quotaExceeded is set to true
 * when the underlying mutation failed because the user has reached the
 * plan's generation quota, so the UI can show an upgrade prompt.
 */
export type ReplyDraftError = {
  /**
   * human readable error message.
   */
  message: string;

  /**
   * whether the error represents a quota-exceeded failure.
   */
  quotaExceeded: boolean;
};

export type UseReplyDraftValue = {
  /**
   * the currently generated reply draft, if any.
   */
  draft?: ReplyDraft;

  /**
   * whether a generate/regenerate request is in flight.
   */
  generating: boolean;

  /**
   * the last error raised while generating a draft, if any.
   */
  error?: ReplyDraftError;

  /**
   * generate a reply draft for the given email, optionally guided by
   * free-text instructions.
   */
  generate: (emailId: string, instructions?: string) => Promise<void>;

  /**
   * regenerate a draft using the last emailId/instructions passed to generate.
   * does nothing if generate has not been called yet.
   */
  regenerate: () => Promise<void>;

  /**
   * discard the current draft and clear any error state.
   */
  discard: () => void;
};

function toReplyDraftError(caughtError: unknown): ReplyDraftError {
  const graphQLErrors = (caughtError as { graphQLErrors?: Array<{ extensions?: { code?: string } }> })
    ?.graphQLErrors;
  const code = graphQLErrors?.[0]?.extensions?.code;

  const message = caughtError instanceof Error ? caughtError.message : 'Failed to generate reply';
  const quotaExceeded = code === 'QUOTA_EXCEEDED' || message.toLowerCase().includes('quota');

  return {
    message,
    quotaExceeded,
  };
}

/**
 * useReplyDraft manages the lifecycle of an AI generated reply draft for
 * an email: generating it, regenerating it with the same parameters, and
 * discarding it. Quota-exceeded failures are surfaced distinctly through
 * error.quotaExceeded so the UI can show an upgrade prompt instead of a
 * generic error message.
 */
export function useReplyDraft(): UseReplyDraftValue {
  const [draft, setDraft] = useState<ReplyDraft | undefined>(undefined);
  const [error, setError] = useState<ReplyDraftError | undefined>(undefined);
  const lastRequestRef = useRef<{ emailId: string; instructions?: string } | undefined>(undefined);

  const [generateReplyMutation, { loading }] =
    useMutation<GenerateReplyMutationResult>(GENERATE_REPLY_MUTATION);

  const generate = useCallback(
    async (emailId: string, instructions?: string) => {
      lastRequestRef.current = { emailId, instructions };
      setError(undefined);

      try {
        const result = await generateReplyMutation({
          variables: { options: { emailId, instructions } },
        });

        const generatedDraft = result.data?.generateReply;
        if (generatedDraft) {
          setDraft(ReplyDraft.from(generatedDraft));
        }
      } catch (caughtError) {
        setError(toReplyDraftError(caughtError));
      }
    },
    [generateReplyMutation]
  );

  const regenerate = useCallback(async () => {
    const lastRequest = lastRequestRef.current;
    if (!lastRequest) {
      return;
    }

    await generate(lastRequest.emailId, lastRequest.instructions);
  }, [generate]);

  const discard = useCallback(() => {
    setDraft(undefined);
    setError(undefined);
  }, []);

  return {
    draft,
    generating: loading,
    error,
    generate,
    regenerate,
    discard,
  };
}
