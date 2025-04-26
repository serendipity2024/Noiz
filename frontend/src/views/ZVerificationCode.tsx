import React, { ReactElement, useState } from 'react';
import { Button, Form } from 'antd';
import CountDown from 'ant-design-pro/lib/CountDown';
import moment from 'moment';
import StyleModule from './ZResetPasswordView.module.scss';
import useLocale from '../hooks/useLocale';
import i18n from './ZVerificationCode.i18n.json';
import useNotificationDisplay from '../hooks/useNotificationDisplay';
import useLogger from '../hooks/useLogger';
import { SendResetPasswordVerificationCode } from '../graphQL/__generated__/SendResetPasswordVerificationCode';
import { ZInput } from '../zui';

export interface verificationData {
  method: string;
  sendTo: string;
}

export interface verificationInterface {
  getSendData: any;
  mutation: any;
}

const VERIFICATION_CODE_SEND_INTERVAL_MS = 60000;

export function ZVerificationCode(sendInterface: verificationInterface): ReactElement {
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [targetTime, setTargetTime] = useState(new Date().getTime());
  const { localizedContent: content } = useLocale(i18n);
  const displayNotification = useNotificationDisplay();
  const logger = useLogger();

  const handleOnSendVerification = (): void => {
    const sendData: verificationData = sendInterface.getSendData();
    setVerificationLoading(true);
    const handleFailure = (error: any) => {
      setVerificationLoading(false);
      displayNotification('SEND_VERIFICATION_CODE_FAILURE');
      logger.error('failed-to-send-verification-code', { error });
    };

    const sendCode = async () => {
      try {
        const rsp = await sendInterface.mutation({
          variables: { sendTo: sendData.sendTo, method: sendData.method },
        });
        const success = rsp?.data as SendResetPasswordVerificationCode;
        if (!success) {
          handleFailure('failed to send code');
          return;
        }
        displayNotification('SEND_VERIFICATION_CODE_SUCCESS');
        setTargetTime(new Date().getTime() + VERIFICATION_CODE_SEND_INTERVAL_MS);
        setCountdown(true);
      } catch (error) {
        handleFailure(error);
      }
    };
    sendCode();
  };

  return (
    <>
      <div className={StyleModule.contactInputTitleContainer}>
        <span className={StyleModule.subtitleText}>{content.verificationCode}</span>
      </div>
      <Form.Item
        name="verification"
        rules={[
          {
            required: true,
            message: content.verificationCodeError,
          },
        ]}
        validateTrigger={['onBlur']}
      >
        <div className={StyleModule.inlineInputContainer}>
          <ZInput
            className={StyleModule.inlineInput}
            placeholder="verification code"
            lightBackground
          />
          <Button
            loading={verificationLoading}
            className={StyleModule.inlineButton}
            onClick={() => {
              handleOnSendVerification();
            }}
          >
            {countdown ? (
              <CountDown
                format={(time) => <span>{`${moment(time).format('ss')}${content.tryAgain}`}</span>}
                target={targetTime}
                onEnd={() => {
                  setCountdown(false);
                  setVerificationLoading(false);
                }}
              />
            ) : (
              content.getVerificationCode
            )}
          </Button>
        </div>
      </Form.Item>
    </>
  );
}
