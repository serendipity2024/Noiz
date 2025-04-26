/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { CheckCircleFilled } from '@ant-design/icons';
import { Input, Modal, Space } from 'antd';
import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import useLocale from '../hooks/useLocale';
import styles from './ZUserProfile.module.scss';
import i18n from './ZUserProfile.i18n.json';
import useStores from '../hooks/useStores';
import { AgeRange } from '../graphQL/__generated__/globalTypes';
import CompleteIcon from '../shared/assets/icons/complete.svg';
import { AccountTag } from '../mobx/stores/AccountTagStore';
import { showOnceComponent } from '../components/editor/ZShowOnceComponet';

enum QuestionKey {
  industry = 'industry',
  ageRange = 'ageRange',
}
enum IndustryIndustryAnswerKey {
  designer = 'designer',
  productManager = 'productManager',
  entrepreneur = 'entrepreneur',
  engineer = 'engineer',
  others = 'others',
}

enum AgeRangeAnswerKey {
  bwlow_18 = 'bwlow_18',
  arg20_24 = 'arg20_24',
  arg25_34 = 'arg25_34',
  arg35_44 = 'arg35_44',
  above_45 = 'above_45',
}

const AgeRangeKeyMap: Partial<Record<AgeRangeAnswerKey, AgeRange>> = {
  [AgeRangeAnswerKey.above_45]: AgeRange.ABOVE_45,
  [AgeRangeAnswerKey.arg20_24]: AgeRange.AGE20_24,
  [AgeRangeAnswerKey.arg25_34]: AgeRange.AGE25_34,
  [AgeRangeAnswerKey.arg35_44]: AgeRange.AGE35_44,
  [AgeRangeAnswerKey.bwlow_18]: AgeRange.BELOW_18,
};
interface Question {
  questionValue: string;
  questionKey: QuestionKey;
  answers: Partial<Record<IndustryIndustryAnswerKey | AgeRangeAnswerKey, string>>;
}

interface Answer {
  answerKey: IndustryIndustryAnswerKey | AgeRangeAnswerKey;
  answerValue: string;
}

export const ZUserProfile = observer(function ZUserProfile() {
  const { accountStore, accountTagStore } = useStores();
  const history = useHistory();
  const [industryAnswerInput, setIndustryAnswerInput] = useState<undefined | string>();
  const [curQuestion, setCurQuestion] = useState<number>(0);
  const [curAnswer, setCurAnswer] = useState<Answer>();
  const isFinished = !!(
    accountStore.account.userProfile?.ageRange && accountStore.account.userProfile?.industry
  );
  const { localizedContent: content } = useLocale(i18n);

  const QUESTIONS: Question[] = [
    {
      questionValue: content.quesition.industry,
      questionKey: QuestionKey.industry,
      answers: {
        [IndustryIndustryAnswerKey.designer]: content.answers.industry.designer,
        [IndustryIndustryAnswerKey.productManager]: content.answers.industry.productManager,
        [IndustryIndustryAnswerKey.entrepreneur]: content.answers.industry.entrepreneur,
        [IndustryIndustryAnswerKey.engineer]: content.answers.industry.engineer,
        [IndustryIndustryAnswerKey.others]: content.answers.industry.others,
      },
    },
    {
      questionValue: content.quesition.ageRange,
      questionKey: QuestionKey.ageRange,
      answers: {
        [AgeRangeAnswerKey.bwlow_18]: content.answers.ageRange.bwlow_18,
        [AgeRangeAnswerKey.arg20_24]: content.answers.ageRange.arg20_24,
        [AgeRangeAnswerKey.arg25_34]: content.answers.ageRange.arg25_34,
        [AgeRangeAnswerKey.arg35_44]: content.answers.ageRange.arg35_44,
        [AgeRangeAnswerKey.above_45]: content.answers.ageRange.above_45,
      },
    },
  ];

  const updateAccountProfile = async () => {
    if (!curAnswer) return;
    try {
      switch (QUESTIONS[curQuestion].questionKey) {
        case QuestionKey.industry:
          if (curAnswer.answerKey === IndustryIndustryAnswerKey.others && !industryAnswerInput) {
            return;
          }
          await accountStore.updateAccountProfile({
            industry:
              curAnswer.answerKey === IndustryIndustryAnswerKey.others
                ? industryAnswerInput
                : curAnswer?.answerValue,
          });
          break;
        case QuestionKey.ageRange:
          await accountStore.updateAccountProfile({
            ageRange: AgeRangeKeyMap[curAnswer.answerKey as AgeRangeAnswerKey],
          });
          break;
        default:
      }
      setCurQuestion(curQuestion + 1);
      setCurAnswer(undefined);
      setIndustryAnswerInput(undefined);
    } catch (err) {
      window.console.log(err.message);
    }
  };

  const onFinish = () => {
    accountTagStore.saveAccountTagAsFinished(AccountTag.SHOW_USER_PROFILE);
  };

  useEffect(() => {
    updateAccountProfile();
  }, [curAnswer]);

  useEffect(() => {
    if (isFinished) onFinish();
  }, [isFinished]);

  useEffect(() => {
    accountStore.fetchUserAccount();
  }, []);

  const renderQuestion = (current: number) => {
    if (curQuestion >= QUESTIONS.length) return null;
    const { questionValue, answers } = QUESTIONS[current];
    return (
      <>
        <p className={styles.question}>{questionValue}</p>
        <ul className={styles.answers}>
          {Object.entries(answers).map(([answerKey, answerValue]) => {
            return (
              <li
                key={answerKey}
                className={curAnswer?.answerValue === answerValue ? styles.select : ''}
                onClick={() => {
                  if (answerValue) {
                    setCurAnswer({
                      answerKey: answerKey as IndustryIndustryAnswerKey,
                      answerValue,
                    });
                  }
                }}
              >
                <Space align="center" size="middle">
                  {curAnswer?.answerValue === answerValue ? (
                    <CheckCircleFilled />
                  ) : (
                    <i className={styles.unselectIcon} />
                  )}
                  {answerValue === curAnswer?.answerValue &&
                  answerKey === IndustryIndustryAnswerKey.others ? (
                    <div className={styles.inputBox}>
                      <Input
                        autoFocus
                        defaultValue={industryAnswerInput}
                        placeholder={content.inputPlaceholder}
                        onChange={(e) => setIndustryAnswerInput(e.target.value)}
                      />
                      <span
                        onClick={() => {
                          if (industryAnswerInput) {
                            setCurAnswer({
                              answerKey: IndustryIndustryAnswerKey.others,
                              answerValue: industryAnswerInput,
                            });
                          }
                        }}
                      >
                        {content.next}
                      </span>
                    </div>
                  ) : (
                    <span>{answerValue}</span>
                  )}
                </Space>
              </li>
            );
          })}
        </ul>
      </>
    );
  };
  return (
    <>
      <Modal className={styles.modal} visible={!isFinished} footer={null} closable={false}>
        <div className={styles.modalHeader}>
          <p>{content.title}</p>
          <Space size="large">
            {curQuestion > 0 && (
              <span onClick={() => setCurQuestion(curQuestion - 1)}>{content.previous}</span>
            )}
            <span
              onClick={() => {
                onFinish();
                history.push('/projects');
              }}
            >
              {content.later}
            </span>
          </Space>
        </div>
        <div className={styles.modalContent}>{renderQuestion(curQuestion)}</div>
      </Modal>
      <Modal className={styles.modal} visible={isFinished} footer={null} closable={false}>
        <div className={styles.feedbackTitle}>
          <img src={CompleteIcon} alt="" />
          <p>{content.feedbackTitle}</p>
        </div>
        <div className={styles.feedbackContent}>
          {QUESTIONS.map((question) => {
            if (!accountStore.account.userProfile) return null;
            let value = accountStore.account.userProfile[question.questionKey];
            if (question.questionKey === QuestionKey.ageRange) {
              const argRange = Object.entries(AgeRangeKeyMap).find((a) => a[1] === value);
              if (argRange) {
                value = content.answers.ageRange[argRange[0] as AgeRangeAnswerKey];
              }
            }
            return (
              <div key={question.questionKey}>
                <span>{question.questionValue}</span>
                <i>{value}</i>
              </div>
            );
          })}
          <button
            type="button"
            className={styles.feedbackButton}
            onClick={() => {
              onFinish();
              history.push('/projects');
            }}
          >
            {content.complete}
          </button>
        </div>
      </Modal>
    </>
  );
});

export const ShowOnceUserProfile = showOnceComponent((): null => {
  const history = useHistory();
  useEffect(() => {
    history.push('/userProfile');
  }, []);
  return null;
}, AccountTag.SHOW_USER_PROFILE);
