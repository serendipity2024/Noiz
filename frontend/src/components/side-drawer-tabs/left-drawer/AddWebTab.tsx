/* eslint-disable import/no-default-export */
import { transaction } from 'mobx';
import React, { ReactElement, useState } from 'react';
import Modal from 'react-modal';
import useLocale from '../../../hooks/useLocale';
import useLocalizedComponentModelType from '../../../hooks/useLocalizedComponentModelType';
import { ComponentModelType } from '../../../shared/type-definition/ComponentModelType';
import { ZThemedBorderRadius } from '../../../utils/ZConst';
import ZCategorizedMenu, { MenuCategory, MenuOption } from '../base/ZCategorizedMenu';
import i18n from './AddWebTab.i18n.json';
import useStores from '../../../hooks/useStores';
import { AllStores } from '../../../mobx/StoreContexts';
import ComponentDiff from '../../../diffs/ComponentDiff';
import BasicWebModel from '../../../models/basic-components/BasicWebModel';
import { Input, Row } from '../../../zui';

export default function AddWebTab(): ReactElement {
  const localizeModelType = useLocalizedComponentModelType();
  const { localizedContent } = useLocale(i18n);
  const { editorStore } = useStores();
  const [modalIsOpen, setModalIsOpen] = useState<ComponentModelType | null>(null);
  const [modalInput, setModalInput] = useState('');

  const handleOptionOnClick = (type: ComponentModelType): void => setModalIsOpen(type);
  const handleScreenCreation = (screenName: string) => {
    if (!modalIsOpen) return;
    transaction(() => {
      let web;
      switch (modalIsOpen) {
        case ComponentModelType.WEB_PAGE:
          web = new BasicWebModel(screenName);
          break;
        default:
          return;
      }

      editorStore.selectedLeftDrawerKey = null;
      const diffItems = [
        ComponentDiff.buildAddPageMRefDiff(web.mRef),
        ...web.onCreateComponentDiffs(),
      ];
      AllStores.diffStore.applyDiff(diffItems);
    });
  };

  const basicScreenOption: MenuOption = {
    name: localizeModelType(ComponentModelType.WEB_PAGE),
    type: ComponentModelType.WEB_PAGE,
    image: null,
    onClick: () => handleOptionOnClick(ComponentModelType.WEB_PAGE),
  };
  const screenOptions: MenuCategory[] = [
    {
      categoryName: localizedContent.menuCategories.popular,
      options: [basicScreenOption],
    },
  ];

  const renderModalView = () => (
    <Modal
      isOpen={!!modalIsOpen}
      style={{ content: styles.modalStylesContent, overlay: styles.modalStylesOverlay }}
      ariaHideApp={false}
      onRequestClose={() => setModalIsOpen(null)}
    >
      <h3 style={{ marginBottom: '30px' }}>{localizedContent.modal.title}</h3>
      <Input
        placeholder={localizedContent.modal.placeholder}
        onChange={({ target: { value } }) => setModalInput(value)}
        style={styles.modalInput}
      />
      <Row justify="end" align="middle">
        <button
          type="button"
          style={{ ...styles.modalButton, ...styles.modalCancelButton }}
          onClick={() => setModalIsOpen(null)}
        >
          {localizedContent.modal.cancel}
        </button>
        <button
          type="button"
          style={{
            ...styles.modalButton,
            ...(modalInput ? styles.modalCreateButton : styles.disabledModalCreateButton),
          }}
          disabled={!modalInput}
          onClick={() => {
            handleScreenCreation(modalInput);
            setModalIsOpen(null);
          }}
        >
          {localizedContent.modal.create}
        </button>
      </Row>
    </Modal>
  );

  return (
    <>
      {renderModalView()}
      <ZCategorizedMenu data={screenOptions} />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  modalStylesContent: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    borderWidth: 0,
    borderRadius: ZThemedBorderRadius.LARGE,
  },
  modalStylesOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalInput: {
    color: '#000',
    marginBottom: '20px',
    width: '400px',
    height: '38px',
  },
  modalButton: {
    marginRight: '10px',
    minWidth: '80px',
    height: '40px',
    borderWidth: 0,
    borderRadius: '20px',
    cursor: 'pointer',
  },
  modalCancelButton: {
    background: '#eee',
  },
  modalCreateButton: {
    color: '#fff',
    background: '#297',
  },
  disabledModalCreateButton: {
    color: '#fff',
    background: 'lightgrey',
    cursor: 'not-allowed',
  },
};
