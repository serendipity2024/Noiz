import React, { useState } from 'react';
import { Button, Modal, ZInput } from '../../zui';
import useUserFlowTrigger, { UserFlow } from '../../hooks/useUserFlowTrigger';
import { NullableReactElement, ShortId } from '../../shared/type-definition/ZTypes';
import cssModule from './ProjectCreator.module.scss';
import i18n from './ProjectCreator.i18n.json';
import useLocale from '../../hooks/useLocale';

interface Props {
  visible: boolean;
  exId: string | undefined;

  onCancel: () => void;
  onProjectCreate: (projectExId: ShortId) => void;
}

const MODAL_WIDTH = '366px';

export function ProjectCreator(props: Props): NullableReactElement {
  const { visible, exId, onCancel, onProjectCreate } = props;
  const utf = useUserFlowTrigger();
  const [projectName, setProjectName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const onsubmit = () => {
    utf(UserFlow.CREATE_PROJECT)(exId, projectName, setLoading, onProjectCreate);
  };
  const { localizedContent: content } = useLocale({
    EN: i18n.en,
    ZH: i18n.zh
  });
  return (
    <Modal
      visible={visible}
      footer={null}
      className={cssModule.container}
      centered
      closable={false}
      width={MODAL_WIDTH}
    >
      <div className={cssModule.titleContainer}>
        <div className={cssModule.title}>{content.title}</div>
      </div>
      <ZInput
        value={projectName}
        onChange={(value: string) => setProjectName(value)}
        className={cssModule.input}
      />
      <div className={cssModule.buttonContainer}>
        <div className={cssModule.cancelButtonContainer}>
          <Button onClick={onCancel} className={cssModule.cancelButton}>
            {content.cancel}
          </Button>
        </div>
        <div className={cssModule.submitButtonContainer}>
          <Button loading={loading} onClick={onsubmit} className={cssModule.submitButton}>
            {content.build}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
