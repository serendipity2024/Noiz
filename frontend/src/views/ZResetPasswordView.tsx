import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, message, Select } from 'antd';
import 'antd/dist/antd.css';
import React, { ReactElement, useEffect, useState } from 'react';
import { Store } from 'antd/lib/form/interface';
import { DownOutlined } from '@ant-design/icons';
import phone from 'phone';
import { isEmpty } from 'lodash/fp';
import { verificationInterface, ZVerificationCode } from './ZVerificationCode';
import StyleModule from './ZResetPasswordView.module.scss';
import ZPageTitle from '../components/editor/ZPageTitle';
import ZZionLogo from '../components/editor/ZZionLogo';
import useLocale from '../hooks/useLocale';
import useNotificationDisplay from '../hooks/useNotificationDisplay';
import useResponsiveWindow from '../hooks/useResponsiveWindow';
import LoginSrc from '../shared/assets/login-pic.svg';
import i18n from './ZResetPasswordView.i18n.json';
import { GQL_SEND_RESETPASSWORD_VERIFICATION_CODE } from '../graphQL/sendResetPasswordVerificationCode';
import { GQL_RESET_PASSWORD } from '../graphQL/resetPassword';
import GQL_FETCH_COUNTRIES from '../graphQL/fetchCountries';
import useStores from '../hooks/useStores';
import useLogger from '../hooks/useLogger';
import { ZInput } from '../zui';

interface SubmissionData {
  username: string;
  sendTo: string;
  verificationCode: string;
  method: string;
  password: string;
}

interface Country {
  phoneAreaCode: string;
  chineseName: string;
  englishName: string;
}

interface CountryData {
  allCountries: Country[];
}

export function ZResetPasswordView(): ReactElement {
  const EMAIL = 'email';
  const PHONE_NUMBER = 'phoneNumber';
  const { isPortrait } = useResponsiveWindow();
  const { localizedContent: content, locale } = useLocale(i18n);
  const displayNotification = useNotificationDisplay();
  const [form] = Form.useForm();
  const logger = useLogger();
  const { authStore } = useStores();
  const { loading: countryListLoading, data: countryList } =
    useQuery<CountryData>(GQL_FETCH_COUNTRIES);
  const [resetPassword, { loading: submissionLoading }] = useMutation(GQL_RESET_PASSWORD);
  const sendVerificationCodeMutation = useMutation(GQL_SEND_RESETPASSWORD_VERIFICATION_CODE)[0];
  const [contactForm, setContactFormState] = useState<'email' | 'phoneNumber'>(EMAIL);

  const handleOnFormSubmission = (value: Store): void => {
    const { username, phoneNumber, email, verification, prefix, newPassword } = value;
    const variables: SubmissionData = {
      username,
      sendTo: contactForm === EMAIL ? email : prefix + phoneNumber,
      verificationCode: verification,
      method: contactForm === EMAIL ? 'EMAIL' : 'SMS',
      password: newPassword,
    };

    const reset = async () => {
      try {
        await resetPassword({ variables });
        displayNotification('RESET_PASSWORD_SUCCESS');
        authStore.logout();
      } catch (e) {
        const error = e.message.split('GraphQL error: ');
        message.error(error);
        logger.info('failed-to-reset-password', { error });
      }
    };
    reset();
  };

  const buttonDisabled = () =>
    Object.values(
      form.getFieldsValue([
        contactForm,
        'verification',
        'username',
        'newPassword',
        'confirmPassword',
      ])
    ).filter((value) => !value).length > 0 ||
    form.getFieldsError().filter(({ errors }) => errors.length).length !== 0 ||
    !(form.getFieldValue('newPassword') === form.getFieldValue('confirmPassword'));

  useEffect(() => {
    if (!isEmpty(form.getFieldValue(contactForm))) {
      form.setFields([{ name: contactForm, touched: true }]);
      form.validateFields([contactForm]);
    } else {
      form.setFields([{ name: contactForm, touched: false }]);
    }
  }, [contactForm, form]);

  const renderIllustration = () => (
    <>
      <img alt="" className={StyleModule.img} src={LoginSrc} />
      <div className={StyleModule.spacing} />
    </>
  );

  const renderContactFormInput = () => {
    const [title, switchButton] =
      contactForm === EMAIL ? [content.email, content.phone] : [content.phone, content.email];

    const resetByEmail = () => {
      return (
        <Form.Item
          name={EMAIL}
          rules={[
            {
              required: contactForm === EMAIL,
              type: EMAIL,
              message: content.emailError,
            },
          ]}
          validateTrigger={['onBlur']}
        >
          <ZInput
            key={content.email}
            className={StyleModule.input}
            placeholder={EMAIL}
            lightBackground
          />
        </Form.Item>
      );
    };

    const { Option } = Select;

    const resetByPhoneNumber = () => {
      const countries = countryList?.allCountries
        .sort((a, b) => {
          if (locale === 'EN') return a.englishName.localeCompare(b.englishName);
          return a.chineseName.localeCompare(b.chineseName);
        })
        .map((country) => (
          <Option
            key={country.englishName}
            value={`+${country.phoneAreaCode}`}
            className={StyleModule.option}
          >
            {`${locale === 'EN' ? country.englishName : country.chineseName}:+${
              country.phoneAreaCode
            }`}
          </Option>
        ));
      return (
        <Form.Item>
          <Input.Group compact className={StyleModule.inlineInputContainer}>
            <Form.Item name="prefix" initialValue="+86" noStyle>
              <Select
                showSearch
                className={StyleModule.inlineButton}
                size="small"
                bordered={false}
                dropdownClassName={StyleModule.dropdown}
                dropdownMatchSelectWidth={false}
                suffixIcon={<DownOutlined className={StyleModule.dropdownArrow} />}
                loading={countryListLoading}
                optionFilterProp="children"
                optionLabelProp="label"
              >
                {countries}
              </Select>
            </Form.Item>
            <Form.Item
              name={PHONE_NUMBER}
              rules={[
                {
                  required: contactForm === PHONE_NUMBER,
                  message: content.phoneError,
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || phone(getFieldValue('prefix') + value).length !== 0)
                      return Promise.resolve();
                    return Promise.reject(content.phoneError);
                  },
                }),
              ]}
              validateTrigger={['onBlur']}
              noStyle
            >
              <ZInput
                key={content.phone}
                className={StyleModule.inlineInput}
                placeholder="phone number"
                lightBackground
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      );
    };
    const toggleContactMethod = () => {
      if (contactForm === EMAIL) {
        setContactFormState(PHONE_NUMBER);
      } else {
        setContactFormState(EMAIL);
      }
    };
    const sendData = () => {
      return contactForm === EMAIL
        ? { sendTo: form.getFieldValue(EMAIL), method: 'EMAIL' }
        : {
            sendTo: form.getFieldValue('prefix') + form.getFieldValue(PHONE_NUMBER),
            method: 'SMS',
          };
    };
    const sendVerificationCodeInput: verificationInterface = {
      mutation: sendVerificationCodeMutation,
      getSendData: sendData,
    };
    return (
      <>
        <div className={StyleModule.contactInputTitleContainer}>
          <span className={StyleModule.subtitleText}>{title}</span>
          <Button
            type="text"
            className={StyleModule.switchButton}
            size="small"
            onClick={toggleContactMethod}
          >
            {switchButton}
          </Button>
        </div>
        {contactForm === EMAIL ? resetByEmail() : resetByPhoneNumber()}
        {ZVerificationCode(sendVerificationCodeInput)}
      </>
    );
  };
  return (
    <div className={StyleModule.ZResetPasswordView}>
      <ZPageTitle>reset password</ZPageTitle>
      <div className={isPortrait ? StyleModule.portraitStylesContainer : StyleModule.container}>
        <ZZionLogo />
        {isPortrait ? null : renderIllustration()}
        <div className={StyleModule.form}>
          <p className={StyleModule.title}>{content.title}</p>
          <Form name="resetPassword" form={form} onFinish={handleOnFormSubmission}>
            <div className={StyleModule.inputTitleContainer}>
              <span className={StyleModule.subtitleText}>{content.username}</span>
            </div>
            <Form.Item
              name="username"
              rules={[{ required: true, message: content.usernameError }]}
              validateTrigger={['onBlur']}
            >
              <ZInput className={StyleModule.input} placeholder="username" lightBackground />
            </Form.Item>

            {renderContactFormInput()}

            <div className={StyleModule.inputTitleContainer}>
              <span className={StyleModule.subtitleText}>{content.newPassword}</span>
            </div>
            <Form.Item
              name="newPassword"
              rules={[{ required: true, message: content.newPasswordError }]}
              validateTrigger={['onBlur']}
            >
              <ZInput
                className={StyleModule.input}
                type="password"
                placeholder="new password"
                lightBackground
              />
            </Form.Item>

            <div className={StyleModule.inputTitleContainer}>
              <span className={StyleModule.subtitleText}>{content.confirmPassword}</span>
            </div>
            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: content.confirmPasswordError,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(content.confirmPasswordDifferent));
                  },
                }),
              ]}
              validateTrigger={['onBlur']}
            >
              <ZInput
                className={StyleModule.input}
                type="password"
                placeholder="confirm password"
                lightBackground
              />
            </Form.Item>

            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  className={
                    buttonDisabled()
                      ? StyleModule.submitButtonDisabled
                      : StyleModule.submitButtonAbled
                  }
                  loading={submissionLoading}
                  disabled={buttonDisabled()}
                >
                  {content.title}
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
