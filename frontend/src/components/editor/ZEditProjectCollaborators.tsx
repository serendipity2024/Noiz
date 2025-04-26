import { Col, Row, Modal } from 'antd';
import React, { useEffect } from 'react';
import { ExclamationCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useObserver } from 'mobx-react';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import i18n from './ZEditProjectCollaborators.i18n.json';
import cssModule from './ZEditProjectCollaborators.module.scss';
import useLocale from '../../hooks/useLocale';
import useStores from '../../hooks/useStores';

const { confirm } = Modal;

export function ZEditProjectCollaborators(): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { projectStore } = useStores();
  const projectAccounts = useObserver(() => projectStore.projectAccount);

  useEffect(() => {
    projectStore.fetchProjectAccount();
  }, []);

  function showConfirmModal(item: any) {
    confirm({
      className: cssModule.modalContainer,
      width: '500px',
      icon: <ExclamationCircleOutlined />,
      content: (
        <span className={cssModule.title}>
          {content.action.deleteTextFirst + item.username + content.action.deleteTextSecond}
        </span>
      ),
      maskClosable: true,
      okText: 'Confirm',
      onOk() {
        projectStore.removeProjectAccount(item.exId);
      },
      okButtonProps: {
        className: cssModule.okButton,
      },
    });
  }

  return (
    <>
      {projectAccounts.length !== 0 && (
        <div className={cssModule.editTableContainer}>
          <Row className={cssModule.editHeader} justify="space-between">
            <Col span={4}>{content.username}</Col>
            <Col span={4}>{content.role}</Col>
            <Col span={4} />
          </Row>
          {projectAccounts.map((e) => {
            return (
              <Row className={cssModule.editRow} justify="space-between" key={e.exId}>
                <Col span={4}>{e.displayName}</Col>
                <Col span={4}>
                  {e.projectCollaboratorType && content.roleType[e.projectCollaboratorType]}
                </Col>
                <Col span={4}>
                  <MinusCircleOutlined
                    className={cssModule.deleteIcon}
                    onClick={() => showConfirmModal(e)}
                  />
                </Col>
              </Row>
            );
          })}
        </div>
      )}
    </>
  );
}
