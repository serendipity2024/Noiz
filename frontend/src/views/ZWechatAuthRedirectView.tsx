/* eslint-disable import/no-default-export */
import { useApolloClient } from '@apollo/client';
import React, { ReactElement, useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import ZLoadingView from './ZLoadingView';
import useLocale from '../hooks/useLocale';
import useLogger from '../hooks/useLogger';
import useNotificationDisplay from '../hooks/useNotificationDisplay';
import useStores from '../hooks/useStores';
import { LoggingEvent } from '../utils/ZLogger';
import { ZColors } from '../utils/ZConst';
import i18n from './ZWechatAuthRedirectView.i18n.json';
import { Button } from '../zui';

interface WechatAuthRedirectParams {
  projectExId: string;
}

function ZWechatAuthRedirectView(
  props: RouteComponentProps<WechatAuthRedirectParams>
): ReactElement {
  const { projectExId } = props.match.params;
  const history = useHistory();
  const client = useApolloClient();
  const logger = useLogger();
  const { localizedContent: content } = useLocale(i18n);
  const displayNotification = useNotificationDisplay();
  const { authStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleWechatAuth = async () => {
      try {
        // Get auth code from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (!authCode) {
          setError(content.noAuthCode);
          setIsLoading(false);
          logger.error(LoggingEvent.WECHAT_AUTH_FAILED, { error: 'No auth code provided' });
          return;
        }

        // Call backend to exchange auth code for access token
        const { data } = await client.mutate({
          mutation: /* GraphQL */ `
            mutation WechatAuth($projectExId: String!, $code: String!) {
              wechatAuth(projectExId: $projectExId, code: $code) {
                success
                message
              }
            }
          `,
          variables: {
            projectExId,
            code: authCode,
          },
        });

        if (data?.wechatAuth?.success) {
          logger.info(LoggingEvent.WECHAT_AUTH_SUCCESS, { projectExId });
          displayNotification('WECHAT_AUTH_SUCCESS');

          // Redirect to project tool page
          setTimeout(() => {
            history.push(`/tool/${projectExId}`);
          }, 1500);
        } else {
          setError(data?.wechatAuth?.message || content.authFailed);
          logger.error(LoggingEvent.WECHAT_AUTH_FAILED, {
            error: data?.wechatAuth?.message || 'Unknown error',
            projectExId
          });
        }
      } catch (error) {
        setError(content.authFailed);
        logger.error(LoggingEvent.WECHAT_AUTH_FAILED, { error, projectExId });
      } finally {
        setIsLoading(false);
      }
    };

    handleWechatAuth();
  }, [client, projectExId, history, logger, content, displayNotification]);

  const handleReturnToProject = () => {
    history.push(`/tool/${projectExId}`);
  };

  if (isLoading) {
    return <ZLoadingView />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>
          {error ? content.authFailedTitle : content.authSuccessTitle}
        </h2>

        {error ? (
          <>
            <p style={styles.errorMessage}>{error}</p>
            <Button type="primary" onClick={handleReturnToProject} style={styles.button}>
              {content.returnToProject}
            </Button>
          </>
        ) : (
          <p style={styles.successMessage}>{content.redirecting}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f0f2f5',
  },
  content: {
    textAlign: 'center' as const,
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    maxWidth: '500px',
    width: '90%',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  successMessage: {
    fontSize: '16px',
    color: ZColors.GREEN,
  },
  errorMessage: {
    fontSize: '16px',
    color: ZColors.RED,
    marginBottom: '20px',
  },
  button: {
    marginTop: '20px',
  },
};

export default ZWechatAuthRedirectView;