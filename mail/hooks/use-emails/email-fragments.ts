import { gql } from '@apollo/client';

/**
 * fields shared by hooks that need the full email, including its body.
 * used by useEmail and useSendReply.
 */
export const EMAIL_DETAIL_FIELDS = gql`
  fragment EmailDetailFields on Email {
    id
    gmailId
    threadId
    sender
    senderEmail
    subject
    body
    snippet
    summary
    category
    importance
    needsReply
    replyGenerated
    bucket
    receivedAt
    read
    archived
  }
`;

/**
 * lightweight fields used for inbox list rows, excluding the body.
 * used by useEmails.
 */
export const EMAIL_SUMMARY_FIELDS = gql`
  fragment EmailSummaryFields on Email {
    id
    gmailId
    threadId
    sender
    senderEmail
    subject
    snippet
    summary
    category
    importance
    needsReply
    replyGenerated
    bucket
    receivedAt
    read
    archived
  }
`;
