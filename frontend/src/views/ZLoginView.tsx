/* eslint-disable import/no-default-export */
/* eslint-disable react/no-unescaped-entities */
import { useApolloClient } from '@apollo/client';
import 'antd/dist/antd.css';
import React, { CSSProperties, ReactElement, useState } from 'react';
import Environment from '../Environment';
import ZLocaleSwitch from '../components/base/ZLocaleSwitch';
import ZPageTitle from '../components/editor/ZPageTitle';
import ZZionLogo from '../components/editor/ZZionLogo';
import GQL_LOGIN from '../graphQL/login';
import useLocale from '../hooks/useLocale';
import useNotificationDisplay from '../hooks/useNotificationDisplay';
import useResponsiveWindow from '../hooks/useResponsiveWindow';
import useStores from '../hooks/useStores';
import { UserData } from '../mobx/data-model/user';
import LoginSrc from '../shared/assets/login-pic.svg';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../utils/ZConst';
import i18n from './ZLoginView.i18n.json';
import './ZLoginView.scss';
import { Button, Form, ZInput } from '../zui';

interface SubmissionData {
  username: string;
  password: string;
}

export default function ZLoginView(): ReactElement {
  const client = useApolloClient();
  const { isPortrait } = useResponsiveWindow();
  const { localizedContent: content } = useLocale(i18n);
  const displayNotification = useNotificationDisplay();
  const { authStore } = useStores();

  const [loading, setLoading] = useState(false);
  const [usernameState, setUsernameState] = useState('');
  const [passwordState, setPasswordState] = useState('');

  const handleFailure = () => {
    displayNotification('LOGIN_FAILURE');
    setLoading(false);
  };

  const handleOnFormSubmission = (values: any): void => {
    setLoading(true);
    client
      .mutate({
        mutation: GQL_LOGIN,
        variables: {
          username: values.username,
          password: values.password,
        } as SubmissionData,
      })
      .then((rsp: any) => {
        const { accessToken: token, roleNames } = rsp?.data?.login ?? {};
        if (!token) {
          handleFailure();
          return;
        }

        const { username } = values;
        authStore.loginFromData({ username, token, roleNames } as UserData);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        handleFailure();
      });
  };

  const buttonDisabled = !usernameState || !passwordState;
  const backgroundColor = buttonDisabled ? ZThemedColors.DISABLED : ZThemedColors.ACCENT;
  const buttonStyle = { ...styles.submitButton, backgroundColor };

  const renderIllustration = () => (
    <>
      <img alt="" style={styles.img} src={LoginSrc} />
      <div style={styles.spacing} />
    </>
  );

  return (
    <>
      <ZPageTitle>Login</ZPageTitle>
      <div style={(isPortrait ? portraitStyles : styles).container}>
        <ZZionLogo />
        {isPortrait ? null : renderIllustration()}
        <div style={styles.form}>
          <p style={styles.title}>{content.title}</p>
          <Form name="normal_login" className="login-form" onFinish={handleOnFormSubmission}>
            <div style={styles.inputTitleContainer}>
              <span style={styles.subtitleText}>{content.username}</span>
            </div>
            <Form.Item name="username" rules={[{ required: true, message: content.usernameError }]}>
              <ZInput
                className="input"
                placeholder="username"
                value={usernameState}
                onChange={(e) => setUsernameState(e.target.value)}
              />
            </Form.Item>

            <div style={styles.inputTitleContainer}>
              <span style={styles.subtitleText}>{content.password}</span>
            </div>
            <Form.Item name="password" rules={[{ required: true, message: content.passwordError }]}>
              <ZInput
                className="input"
                type="password"
                placeholder="password"
                value={passwordState}
                onChange={(e) => setPasswordState(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={buttonStyle}
                disabled={buttonDisabled}
                loading={loading}
              >
                {content.title}
              </Button>
            </Form.Item>
          </Form>
          <div style={styles.footerContainer}>
            <a
              href={`${Environment.httpServerAddress}/oauth2/authorization/wechat?redirect_uri=${window.location.origin}/oauth`}
              style={styles.href}
            >
              {content.wechatLogin}
            </a>
            <span style={{ ...styles.subtitleText, ...styles.border }}>
              {content.noAccount}
              <a href={`/register${window.location.search}`} style={styles.href}>
                {content.register}
              </a>
            </span>
            <span style={styles.subtitleText}>
              {content.forgetPassword}
              <a href="/resetPassword" style={styles.href}>
                {content.resetPassword}
              </a>
            </span>
          </div>
        </div>
      </div>
      <ZLocaleSwitch />
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minWidth: '600px',
    height: '100vh',
    minHeight: '300px',
  },
  img: {
    width: '35%',
    maxWidth: '450px',
    height: '42%',
    minHeight: '300px',
  },
  spacing: {
    width: '15%',
    maxWidth: '200px',
  },
  form: {
    width: '287px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: '44px',
    color: ZColors.WHITE,
    fontSize: '30px',
    lineHeight: '41px',
  },
  inputTitleContainer: {
    margin: '24px 0 10px 0',
  },
  subtitleText: {
    fontSize: '13px',
    fontWeight: 500,
    color: ZColors.WHITE,
  },
  submitButton: {
    marginTop: '40px',
    width: '100%',
    height: '38px',
    color: ZColors.WHITE,
    border: 'none',
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '25%',
  },
  href: {
    fontWeight: 500,
    color: ZThemedColors.ACCENT,
  },
  border: {
    borderTop: '1px solid rgba(255, 255, 255, 0.5)',
    marginTop: '8px',
    paddingTop: '8px',
  },
};

const portraitStyles: Record<string, CSSProperties> = {
  container: {
    ...styles.container,
    margin: '0 5%',
    width: '90%',
    minWidth: 'auto',
    minHeight: '600px',
    paddingTop: '30px',
    overflow: 'hidden',
  },
};
