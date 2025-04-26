/* eslint-disable import/no-default-export */
import { useEffect, useRef } from 'react';
import { LoggingEvent } from '../utils/logging/LogSingleLineToServer';
import ZNotification, {
  ZMessageKey,
  ZNotificationLevel,
} from '../utils/notifications/ZNotifications';
import i18n from '../utils/notifications/ZNotifications.i18n.json';
import useLocale from './useLocale';
import useLogger from './useLogger';

export default function useNotificationDisplay(): (
  messagekey: ZMessageKey,
  callback?: () => void,
  notificationLevel?: ZNotificationLevel
) => void {
  const logger = useLogger();
  const { localizedContent: content } = useLocale(i18n);
  const notif = useRef(new ZNotification(content));
  useEffect(() => {
    notif.current = new ZNotification(content);
  }, [content]);

  return (
    messagekey: ZMessageKey,
    callback?: () => void,
    notificationLevel?: ZNotificationLevel
  ) => {
    if (notificationLevel) {
      notif.current.sendTextNotification(messagekey, notificationLevel);
    } else {
      notif.current.send(messagekey, (data: Record<string, any>) => {
        logger.info(LoggingEvent.NOTIFICATION_DISPLAYED, {
          data,
        });
        if (callback) callback();
      });
    }
  };
}

export type DisplayNotification = ReturnType<typeof useNotificationDisplay>;
