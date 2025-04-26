/* eslint-disable import/no-default-export */
import { DownOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import 'antd/dist/antd.css';
import { Store } from 'antd/lib/form/interface';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import phone from 'phone';
import { isString } from 'lodash';
import ZLocaleSwitch from '../components/base/ZLocaleSwitch';
import ZZionLogo from '../components/editor/ZZionLogo';
import GQL_FETCH_COUNTRIES from '../graphQL/fetchCountries';
import GQL_REGISTER from '../graphQL/register';
import GQL_SEND_REGISTRATION_VERIFICATION_CODE from '../graphQL/sendRegistrationVerificationCode';
import useLocale from '../hooks/useLocale';
import useLogger from '../hooks/useLogger';
import useResponsiveWindow from '../hooks/useResponsiveWindow';
import LoginSrc from '../shared/assets/login-pic.svg';
import { URLParameter, ZColors, ZThemedBorderRadius, ZThemedColors } from '../utils/ZConst';
import './ZLoginView.scss';
import StyleModule from './ZRegisterView.module.scss';
import i18n from './ZRegisterView.i18n.json';
import { Button, Form, Input, Select, message, ZInput } from '../zui';
import { verificationInterface, ZVerificationCode } from './ZVerificationCode';
import { Register } from '../graphQL/__generated__/Register';
import useStores from '../hooks/useStores';

const { Option } = Select;

interface SubmissionData {
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  verificationCode: string;
}

interface Country {
  phoneAreaCode: string;
  chineseName: string;
  englishName: string;
}

interface CountryData {
  allCountries: Country[];
}

export default function ZRegisterView(): ReactElement {
  const history = useHistory();
  const { isPortrait } = useResponsiveWindow();
  const { localizedContent: content, locale } = useLocale(i18n);
  const logger = useLogger();
  const [form] = Form.useForm();
  const { authStore } = useStores();
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [contactForm, setContactFormState] = useState<'email' | 'phoneNumber'>('email');
  const register = useMutation<Register>(GQL_REGISTER)[0];
  const sendVerificationCode = useMutation(GQL_SEND_REGISTRATION_VERIFICATION_CODE)[0];
  const { loading: countryListLoading, data: countryList } =
    useQuery<CountryData>(GQL_FETCH_COUNTRIES);

  const nonEmpty = (value: any) => isString(value) && value.trim().length > 0;
  const handleOnFormSubmission = (value: Store): void => {
    setSubmissionLoading(true);
    const { username, password, phoneNumber, email, verification, prefix } = value;
    const variables = {
      username,
      password,
      [contactForm]: contactForm === 'email' ? email : prefix + phoneNumber,
      verificationCode: verification,
    };
    const urlSearchParams = new URLSearchParams(window.location.search);
    const channel = urlSearchParams.get(URLParameter.channel);
    if (channel) {
      variables.channel = channel;
    }
    register({
      variables,
    })
      .then((res) => {
        if (res.data?.register?.accessToken) {
          authStore.loginFromData({
            username,
            roleNames: res.data.register.roleNames as string[],
            token: res.data.register.accessToken,
          });
        }
        history.push('/');
      })
      .catch((e) => {
        const error = e.message.split('GraphQL error: ');
        message.error(error);
        logger.info('failed-to-register', { error });
        setSubmissionLoading(false);
      });
  };

  const toggleContactMethod = () => {
    if (contactForm === 'email') {
      setContactFormState('phoneNumber');
    } else {
      setContactFormState('email');
    }
  };

  useEffect(() => {
    if (nonEmpty(form.getFieldValue(contactForm))) {
      form.setFields([{ name: contactForm, touched: true }]);
      form.validateFields([contactForm]);
    } else {
      form.setFields([{ name: contactForm, touched: false }]);
    }
  }, [contactForm, form]);

  const renderIllustration = () => (
    <>
      <img alt="" style={styles.img} src={LoginSrc} />
      <div style={styles.spacing} />
    </>
  );

  const renderContactFormInput = () => {
    const titles = [content.email, content.phone];

    const { title, switchButton } =
      contactForm === 'email'
        ? {
            title: titles[0],
            switchButton: titles[1],
          }
        : {
            title: titles[1],
            switchButton: titles[0],
          };

    const Email = () => {
      return (
        <Form.Item
          name="email"
          rules={[
            {
              required: contactForm === 'email',
              type: 'email',
              message: content.emailError,
            },
          ]}
          validateTrigger={['onBlur']}
        >
          <ZInput key={content.email} placeholder="email" lightBackground />
        </Form.Item>
      );
    };

    const PhoneNumber = () => {
      const countries = countryList?.allCountries
        .sort((a, b) => {
          if (locale === 'EN') return a.englishName.localeCompare(b.englishName);
          return a.chineseName.localeCompare(b.chineseName);
        })
        .map((country) => (
          <Option
            key={country.englishName}
            value={`+${country.phoneAreaCode}`}
            style={styles.option}
          >
            {`${locale === 'EN' ? country.englishName : country.chineseName}:+${
              country.phoneAreaCode
            }`}
          </Option>
        ));
      return (
        <Form.Item>
          <Input.Group compact style={styles.inlineInputContainer}>
            <Form.Item name="prefix" initialValue="+86" noStyle>
              <Select
                showSearch
                style={styles.inlineButton}
                size="small"
                bordered={false}
                dropdownStyle={styles.dropdown}
                dropdownMatchSelectWidth={false}
                suffixIcon={<DownOutlined style={styles.dropdownArrow} />}
                loading={countryListLoading}
                optionFilterProp="children"
                optionLabelProp="label"
              >
                {countries}
              </Select>
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  required: contactForm === 'phoneNumber',
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
                className={StyleModule.input}
                placeholder="phone number"
                lightBackground
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      );
    };
    const sendData = () => {
      return contactForm === 'email'
        ? { sendTo: form.getFieldValue('email'), method: 'EMAIL' }
        : {
            sendTo: form.getFieldValue('prefix') + form.getFieldValue('phoneNumber'),
            method: 'SMS',
          };
    };
    const sendVerificationCodeInput: verificationInterface = {
      mutation: sendVerificationCode,
      getSendData: sendData,
    };

    return (
      <>
        <div style={styles.contactInputTitleContainer}>
          <span style={styles.subtitleText}>{title}</span>
          <Button
            type="text"
            style={styles.switchButton}
            size="small"
            onClick={toggleContactMethod}
          >
            {switchButton}
          </Button>
        </div>
        {contactForm === 'email' ? <Email /> : <PhoneNumber />}
        {ZVerificationCode(sendVerificationCodeInput)}
      </>
    );
  };

  const buttonDisabled = () =>
    Object.values(
      form.getFieldsValue([contactForm, 'verification', 'username', 'password'])
    ).filter((value) => !value).length > 0 ||
    form.getFieldsError().filter(({ errors }) => errors.length).length !== 0;

  return (
    <div
      style={(isPortrait ? portraitStyles : styles).container}
      className={StyleModule.ZRegisterView}
    >
      <ZZionLogo />
      {isPortrait ? null : renderIllustration()}
      <div style={styles.form}>
        <p style={styles.title}>{content.title}</p>
        <Form
          name="normal_register"
          className="register-form"
          form={form}
          onFinish={handleOnFormSubmission}
        >
          {renderContactFormInput()}

          <div style={styles.inputTitleContainer}>
            <span style={styles.subtitleText}>{content.username}</span>
          </div>
          <Form.Item
            name="username"
            rules={[{ required: true, message: content.usernameError }]}
            validateTrigger={['onBlur']}
          >
            <ZInput placeholder="username" lightBackground />
          </Form.Item>

          <div style={styles.inputTitleContainer}>
            <span style={styles.subtitleText}>{content.password}</span>
          </div>
          <Form.Item
            name="password"
            rules={[{ required: true, message: content.passwordError }]}
            validateTrigger={['onBlur']}
          >
            <ZInput placeholder="password" lightBackground type="password" />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{
                  ...styles.submitButton,
                  backgroundColor: buttonDisabled() ? ZThemedColors.PRIMARY : ZThemedColors.ACCENT,
                }}
                loading={submissionLoading}
                disabled={buttonDisabled()}
              >
                {content.title}
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
      <ZLocaleSwitch />
    </div>
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
    backgroundColor: ZThemedColors.SECONDARY,
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
  contactInputTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: '24px 0 10px 0',
    width: '100%',
    justifyContent: 'space-between',
  },
  inputTitleContainer: {
    margin: '24px 0 10px 0',
  },
  subtitleText: {
    fontSize: '13px',
    fontWeight: 500,
    color: ZColors.WHITE,
  },
  href: {
    fontWeight: 500,
    color: ZThemedColors.ALTERNATIVE,
    cursor: 'pointer',
  },
  dropdown: {
    backgroundColor: ZThemedColors.PRIMARY,
  },
  dropdownArrow: {
    color: ZColors.WHITE,
  },
  option: {
    background: 'transparent',
    color: ZColors.WHITE,
  },
  input: {
    width: '100%',
    height: '38px',
    paddingLeft: '13px',
    color: ZColors.WHITE,
    backgroundColor: ZThemedColors.PRIMARY,
    border: 'none',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    boxShadow: 'none',
  },
  inlineInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    height: '38px',
    color: ZColors.WHITE,
    backgroundColor: ZThemedColors.PRIMARY,
    border: 'none',
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  inlineInput: {
    paddingLeft: '13px',
    color: ZColors.WHITE,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },
  switchButton: {
    fontSize: '13px',
    fontWeight: 500,
    color: ZThemedColors.ACCENT,
    height: 'auto',
  },
  inlineButton: {
    margin: '6px',
    height: 'auto',
    width: 'auto',
    padding: '0 8px 0 8px',
    color: ZColors.WHITE,
    backgroundColor: ZThemedColors.TERTIARY,
    border: 'none',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    textAlign: 'center',
    fontSize: '12px',
  },
  submitButton: {
    marginTop: '40px',
    width: '100%',
    height: '38px',
    color: ZColors.WHITE,
    border: 'none',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.ACCENT,
  },
  footerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '25%',
  },
};

const portraitStyles: Record<string, CSSProperties> = {
  container: {
    ...styles.container,
    margin: '0 5%',
    width: '90%',
    minWidth: 'auto',
    minHeight: '680px',
    paddingTop: '30px',
    overflow: 'hidden',
  },
};
