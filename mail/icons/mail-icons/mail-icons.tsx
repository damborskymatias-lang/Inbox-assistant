import React from 'react';
import { InboxIcon } from './inbox-icon.js';
import { MailOpenIcon } from './mail-open-icon.js';
import { ArchiveIcon } from './archive-icon.js';
import { TrashIcon } from './trash-icon.js';
import { ReplyIcon } from './reply-icon.js';
import { SendIcon } from './send-icon.js';
import { FlameIcon } from './flame-icon.js';
import { PaperIcon } from './paper-icon.js';
import { CheckCircleIcon } from './check-circle-icon.js';
import { TagIcon } from './tag-icon.js';
import { RefreshIcon } from './refresh-icon.js';
import type { MailIconProps } from './mail-icon-props-type.js';
import type { MailIconName } from './mail-icon-name-type.js';

export type MailIconsProps = {
  /**
   * name of the icon to render from the mail icon set.
   */
  name: MailIconName;

  /**
   * size of the icon, either a preset (xs, sm, md, lg) or a number of pixels.
   */
  size?: MailIconProps['size'];

  /**
   * color of the icon, either a theme color token name or a CSS color value.
   */
  color?: string;

  /**
   * accessible title for the icon. when omitted the icon is hidden from assistive tech.
   */
  title?: string;

  /**
   * class name to override the icon container.
   */
  className?: string;

  /**
   * style to override the icon container.
   */
  style?: MailIconProps['style'];
};

/**
 * Renders a single icon from the mail icon set by name, keeping a
 * consistent stroke style and sizing across all mail related icons.
 */
export function MailIcons({ name, size = 'md', color = 'default', title, className, style }: MailIconsProps) {
  if (name === 'inbox') {
    return <InboxIcon size={size} color={color} title={title} className={className} style={style} />;
  }
  if (name === 'mailOpen') {
    return <MailOpenIcon size={size} color={color} title={title} className={className} style={style} />;
  }
  if (name === 'archive') {
    return <ArchiveIcon size={size} color={color} title={title} className={className} style={style} />;
  }
  if (name === 'trash') {
    return <TrashIcon size={size} color={color} title={title} className={className} style={style} />;
  }
  if (name === 'reply') {
    return <ReplyIcon size={size} color={color} title={title} className={className} style={style} />;
  }
  if (name === 'send') {
    return <SendIcon size={size} color={color} title={title} className={className} style={style} />;
  }
  if (name === 'urgent') {
    return <FlameIcon size={size} color={color} title={title} className={className} style={style} />;
  }
  if (name === 'needsReply') {
    return <PaperIcon size={size} color={color} title={title} className={className} style={style} />;
  }
  if (name === 'fyi') {
    return <CheckCircleIcon size={size} color={color} title={title} className={className} style={style} />;
  }
  if (name === 'promotions') {
    return <TagIcon size={size} color={color} title={title} className={className} style={style} />;
  }
  return <RefreshIcon size={size} color={color} title={title} className={className} style={style} />;
}
