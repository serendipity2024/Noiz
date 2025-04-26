/* eslint-disable import/no-default-export */
import React, { ReactElement, useState } from 'react';
import { useMutation } from '@apollo/client';
import useLocale from '../../../hooks/useLocale';
import useLogger from '../../../hooks/useLogger';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../utils/ZConst';
import LeftDrawerButton from '../../side-drawer-tabs/left-drawer/shared/LeftDrawerButton';
import LeftDrawerTitle from '../../side-drawer-tabs/left-drawer/shared/LeftDrawerTitle';
import i18n from './ZFeedbackPopup.i18n.json';
import './ZFeedbackPopup.scss';
import GQL_CREATE_FEEDBACK from '../../../graphQL/createFeedback';
import { CreateFeedback } from '../../../graphQL/__generated__/CreateFeedback';
import useNotificationDisplay from '../../../hooks/useNotificationDisplay';
import { Input } from '../../../zui';

export default function ZFeedbackPopup(): ReactElement {
  const logger = useLogger();
  const { localizedContent: content } = useLocale(i18n);
  const [csatSelection, setCsatSelection] = useState<string | null>(null);
  const [createFeedbackLoading, setCreateFeedbackLoading] = useState(false);
  const [csatComment, setCsatComment] = useState('');
  const createFeedback = useMutation(GQL_CREATE_FEEDBACK)[0];
  const displayNotif = useNotificationDisplay();

  const handleOnClick = (value: string) => {
    setCsatSelection(value);
  };

  const handleOnFeedbackSubmission = (): void => {
    if (!csatComment && !csatSelection) {
      return;
    }

    setCreateFeedbackLoading(true);
    const handleFailure = (error: any) => {
      setCreateFeedbackLoading(false);
      displayNotif('CREATE_FEEDBACK_FAILURE');
      logger.error('failed-to-create-feedback', { error });
    };

    createFeedback({ variables: { miscData: { csat: csatSelection }, message: csatComment } })
      .then((rsp) => {
        const success = rsp?.data as CreateFeedback;
        if (!success) {
          handleFailure('failed to create feedback');
          return;
        }

        setCreateFeedbackLoading(false);
        displayNotif('CREATE_FEEDBACK_SUCCESS');
        setCsatComment('');
        setCsatSelection(null);
      })
      .catch(handleFailure);
  };

  const renderRatingSection = () => {
    const renderOption = (value: 'good' | 'bad') => (
      <div
        style={{
          ...styles.selectionOption,
          ...(csatSelection === value ? styles.selectedOption : null),
        }}
        onClick={() => handleOnClick(value)}
      >
        <span>{content.rating[value]}</span>
      </div>
    );

    return (
      <div style={styles.selectContainer}>
        {renderOption('good')}
        {renderOption('bad')}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <LeftDrawerTitle textStyle={styles.title}>{content.title}</LeftDrawerTitle>

      <LeftDrawerTitle type="subtitle" textStyle={styles.subtitle}>
        {content.subtitleRating}
      </LeftDrawerTitle>
      {renderRatingSection()}

      <LeftDrawerTitle type="subtitle" textStyle={styles.subtitle}>
        {content.subtitleComment}
      </LeftDrawerTitle>
      <Input.TextArea
        className="textArea"
        style={styles.textArea}
        placeholder={content.placeholder}
        value={csatComment}
        onChange={(e: any) => setCsatComment(e.currentTarget.value)}
      />
      <LeftDrawerButton
        type="primary"
        loading={createFeedbackLoading}
        text={content.submit}
        handleOnClick={() => handleOnFeedbackSubmission()}
      />
    </div>
  );
}

const styles: Record<string, any> = {
  container: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: '76px',
    right: '80px',
    width: '308px',
    height: 'auto',
    padding: '32px 24px',
    backgroundColor: ZThemedColors.PRIMARY,
    borderRadius: ZThemedBorderRadius.LARGE,
  },
  title: {
    width: '100%',
  },
  subtitle: {
    width: '100%',
    margin: '20px 0 6px 0',
  },
  selectContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: '12px 0',
    width: '100%',
    height: '38px',
    backgroundColor: ZThemedColors.SECONDARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    overflow: 'hidden',
  },
  selectionOption: {
    display: 'flex',
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    color: ZColors.WHITE,
    cursor: 'pointer',
  },
  selectedOption: {
    backgroundColor: ZThemedColors.ACCENT,
  },
  textArea: {
    marginTop: '12px',
    height: '100px',
    color: ZColors.WHITE,
    backgroundColor: ZThemedColors.SECONDARY,
    border: 'none',
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
};
