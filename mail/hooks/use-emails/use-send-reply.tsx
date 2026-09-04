import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Email, type PlainEmail } from '@lov/mail.entities.email';
import { EMAIL_DETAIL_FIELDS } from './email-fragments.js';

const SEND_REPLY_MUTATION = gql`
  mutation SendReply($options: SendReplyOptions!) {
    sendReply(options: $options) {
      ...EmailDetailFields
    }
  }
  ${EMAIL_DETAIL_FIELDS}
`;

export type UseSendReplyResult = {
  /**
   * sends a reply to the given email, updating the Apollo cache
   * optimistically so the email is marked as replied instantly.
   */
  sendReply: (emailId: string, body: string) => Promise<Email | undefined>;

  /**
   * whether the mutation is currently in flight.
   */
  loading: boolean;

  /**
   * error raised while sending the reply, if any.
   */
  error?: Error;
};

/**
 * sends a reply to an email. the cache is updated optimistically,
 * marking the email as having a reply already sent before the server
 * responds.
 */
export function useSendReply(): UseSendReplyResult {
  const [sendReplyMutation, { loading, error }] = useMutation<{ sendReply: PlainEmail }>(SEND_REPLY_MUTATION);

  const sendReply = async (emailId: string, body: string) => {
    const result = await sendReplyMutation({
      variables: { options: { emailId, body } },
      optimisticResponse: {
        sendReply: {
          id: emailId,
          gmailId: emailId,
          threadId: null,
          sender: '',
          senderEmail: '',
          subject: '',
          body,
          snippet: body.slice(0, 80),
          summary: null,
          category: null,
          importance: null,
          needsReply: false,
          replyGenerated: true,
          bucket: 'fyi',
          receivedAt: new Date().toISOString(),
          read: true,
          archived: false,
        },
      },
    });

    return result.data?.sendReply ? Email.from(result.data.sendReply) : undefined;
  };

  return { sendReply, loading, error };
}
