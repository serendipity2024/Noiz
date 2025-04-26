/* eslint-disable import/no-default-export */
import { useMutation } from '@apollo/client';
import React, { ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ZLocaleSwitch from '../components/base/ZLocaleSwitch';
import ZZionLogo from '../components/editor/ZZionLogo';
import GQL_ACTIVATE_ACCOUNT from '../graphQL/activateAccount';
import useLocale from '../hooks/useLocale';
import useLogger from '../hooks/useLogger';
import useStores from '../hooks/useStores';
import { LoggingEvent } from '../utils/ZLogger';
import { Button, Form, message } from '../zui';
import i18n from './ZActivationView.i18n.json';

function ZActivationView(): ReactElement {
  const history = useHistory();
  const location = useLocation();
  const { localizedContent: content } = useLocale(i18n);
  const logger = useLogger();
  const { authStore } = useStores();
  const [activateAccount, { loading }] = useMutation(GQL_ACTIVATE_ACCOUNT);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const activationToken = params.get('token');

    if (!activationToken) {
      setActivationError(content.noTokenError);
      return;
    }

    const handleActivation = async () => {
      try {
        const { data } = await activateAccount({
          variables: {
            token: activationToken,
          },
        });

        if (data?.activateAccount?.success) {
          setActivationSuccess(true);
          logger.info(LoggingEvent.ACCOUNT_ACTIVATED);
          authStore.refreshLoginStatus();
          setTimeout(() => {
            history.push('/projects');
          }, 2000);
        } else {
          setActivationError(content.activationFailed);
          logger.error(LoggingEvent.ACCOUNT_ACTIVATION_FAILED, {
            error: data?.activateAccount?.message || 'Unknown error',
          });
        }
      } catch (error) {
        setActivationError(content.activationFailed);
        logger.error(LoggingEvent.ACCOUNT_ACTIVATION_FAILED, { error });
      }
    };

    handleActivation();
  }, [activateAccount, authStore, content, history, location.search, logger]);

  const handleReturnToLogin = () => {
    history.push('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <ZZionLogo style={styles.logo} />
      </div>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>{content.title}</h1>
        {loading && <p style={styles.message}>{content.activating}</p>}
        {activationSuccess && <p style={styles.successMessage}>{content.activationSuccess}</p>}
        {activationError && <p style={styles.errorMessage}>{activationError}</p>}

        {activationError && (
          <Form style={styles.form}>
            <Form.Item>
              <Button type="primary" onClick={handleReturnToLogin} style={styles.button}>
                {content.returnToLogin}
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
      <ZLocaleSwitch />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  logoContainer: {
    marginBottom: '40px',
  },
  logo: {
    width: '120px',
  },
  formContainer: {
    width: '400px',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '24px',
    marginBottom: '24px',
  },
  form: {
    marginTop: '24px',
  },
  message: {
    fontSize: '16px',
    color: '#666',
  },
  successMessage: {
    fontSize: '16px',
    color: '#52c41a',
  },
  errorMessage: {
    fontSize: '16px',
    color: '#f5222d',
    marginBottom: '16px',
  },
  button: {
    width: '100%',
  },
};

export default ZActivationView;