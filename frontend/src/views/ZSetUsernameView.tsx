import React, { ReactElement, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router';
import useLocale from '../hooks/useLocale';
import { Button, ZInput } from '../zui';
import styles from './ZSetUsernameView.module.scss';
import i18n from './ZSetUsernameView.i18n.json';
import { GQL_SET_USERNAME } from '../graphQL/setUsername';
import useNotificationDisplay from '../hooks/useNotificationDisplay';
import useStores from '../hooks/useStores';

export function ZSetUsernameView(): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const client = useApolloClient();
  const history = useHistory();
  const { authStore } = useStores();
  const notification = useNotificationDisplay();
  const [username, setUsername] = useState<string>('');

  const onSubmit = () => {
    try {
      client
        .mutate({
          mutation: GQL_SET_USERNAME,
          variables: {
            username,
          },
        })
        .then(() => {
          authStore.loginFromData({
            username,
            token: authStore.userToken,
            roleNames: authStore.user?.roleNames as string[],
          });
          history.push('/');
        });
    } catch (error) {
      notification(error.message);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.text}>{content.enterUsername}</div>
      <div className={styles.subText}>Build faster, dream farther.</div>
      <ZInput
        className={styles.input}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoFocus
      />
      <Button className={styles.button} onClick={() => onSubmit()}>
        {content.login}
      </Button>
    </div>
  );
}
