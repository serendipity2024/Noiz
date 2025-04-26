/* eslint-disable import/no-default-export */
import { useQuery } from '@apollo/client';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TemplatePreview } from '../components/base/TemplatePreview';
import ZPageTitle from '../components/editor/ZPageTitle';
import ZZionLogo from '../components/editor/ZZionLogo';
import ConfigButton from '../components/side-drawer-tabs/left-drawer/shared/ConfigButton';
import { ZAccountDropdown } from '../components/ZProjectActionBar';
import GQL_FETCH_CURRENT_USER_INFO from '../graphQL/fetchCurrentUserInfo';
import GQL_GET_ALL_PROJECTS_FOR_CURRENT_USER from '../graphQL/getAllProjectsForCurrentUser';
import { FetchCurrentUserInfo } from '../graphQL/__generated__/FetchCurrentUserInfo';
import {
  GetAllProjectsForCurrentUser,
  GetAllProjectsForCurrentUser_allProjects,
} from '../graphQL/__generated__/GetAllProjectsForCurrentUser';
import { FeatureType } from '../graphQL/__generated__/globalTypes';
import useLocale, { Locale } from '../hooks/useLocale';
import useStores from '../hooks/useStores';
import { NullableReactElement, NullableShortId } from '../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../utils/ZConst';
import i18n from './ZProjectListView.i18n.json';
import { ShowOnceUserProfile } from './ZUserProfile';

export default function ZProjectListView(): ReactElement {
  const history = useHistory();
  const { editorStore, featureStore } = useStores();
  const { localizedContent: content, locale } = useLocale(i18n);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { loading, data } = useQuery<GetAllProjectsForCurrentUser>(
    GQL_GET_ALL_PROJECTS_FOR_CURRENT_USER
  );
  const { data: account } = useQuery<FetchCurrentUserInfo>(GQL_FETCH_CURRENT_USER_INFO);

  const role = {
    OWNER: content.collaboratorType.owner,
    EDITOR: content.collaboratorType.editor,
    VIEWER: content.collaboratorType.viewer,
  };

  const projects = (data?.allProjects ?? []).sort((a, b) =>
    new Date(a?.lastUploadedSchema?.createdAt) < new Date(b?.lastUploadedSchema?.createdAt) ? 1 : -1
  );

  useEffect(() => {
    if (
      featureStore.isFeatureAccessible(FeatureType.SHOW_SET_USERNAME) &&
      account?.user?.username === ''
    ) {
      history.push('/setUsername');
    }
    if (!editorStore.targetProjectExId && projects.length === 1 && !!projects[0]?.exId) {
      goToProject(projects[0].exId);
    }
    /* eslint-disable-next-line */
  }, [editorStore, projects]);

  if (loading) return <div />;

  const goToProject = (target: NullableShortId) => {
    if (target) {
      history.push(`/tool/${target}`);
    }
  };

  const ProjectRow = (props: {
    row: GetAllProjectsForCurrentUser_allProjects | null;
  }): NullableReactElement => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const { row } = props;
    if (!row || !row.exId) return null;

    return (
      <div
        key={row.exId}
        style={{ ...styles.projectRow, ...(isHovered ? styles.selectedProjectRow : null) }}
        onMouseOver={() => setIsHovered(true)}
        onFocus={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onBlur={() => setIsHovered(false)}
        onClick={() => goToProject(row.exId)}
      >
        <div style={styles.rowSeparator} />
        <div style={styles.rowContent}>
          <span style={{ ...styles.column1, ...styles.projectRowText }}>{row?.projectName}</span>
          <span style={{ ...styles.column1, ...styles.projectRowText }}>{row?.projectOwner}</span>
          <span style={{ ...styles.column1, ...styles.projectRowText }}>
            {row?.collaboratorType && role[row?.collaboratorType]}
          </span>
          <span style={{ ...styles.column2, ...styles.projectRowText }}>
            {formatDate(row?.lastUploadedSchema?.createdAt, locale)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <ZPageTitle>{content.pageTitle}</ZPageTitle>
      <TemplatePreview
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onProjectCreate={(targetProjectExId) => goToProject(targetProjectExId)}
      />
      <div style={styles.background}>
        <div style={styles.container}>
          <div style={styles.header}>
            <ZZionLogo />
            <ConfigButton
              style={styles.configButton}
              zedType="primary"
              onClick={() => setModalVisible(true)}
            >
              {content.createNewProject}
            </ConfigButton>
          </div>
          <div style={styles.content}>
            <div style={styles.contentHeader}>
              <ZAccountDropdown style={styles.account} />
            </div>
            <div style={styles.contentMain}>
              <div style={styles.contentHeaderRow}>
                <span style={{ ...styles.column1, ...styles.columnTitle }}>
                  {content.projectName}
                </span>
                <span style={{ ...styles.column1, ...styles.columnTitle }}>
                  {content.projectOwner}
                </span>
                <span style={{ ...styles.column1, ...styles.columnTitle }}>{content.role}</span>
                <span style={{ ...styles.column2, ...styles.columnTitle }}>
                  {content.lastSavedAt}
                </span>
              </div>
              <div style={styles.contentScroll}>
                {projects.map((r) => (
                  <ProjectRow key={r?.exId ?? ''} row={r} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {featureStore.isFeatureAccessible(FeatureType.SHOW_USER_PROFILE) && <ShowOnceUserProfile />}
    </>
  );
}

function formatDate(date: string | null, locale: Locale = Locale.EN): string {
  if (!date) return '';

  const parsedDate = new Date(date);
  const today = new Date();

  // if within 24 hours, render time
  if (today.valueOf() - parsedDate.valueOf() < 24 * 3600 * 1000) {
    const hour = parsedDate.getHours();
    const minutes = parsedDate.getMinutes();

    const isToday = today.getDate() === parsedDate.getDate();
    const prefix = i18n[locale].time[isToday ? 'today' : 'yesterday'];

    return `${prefix} ${[hour, minutes].map((n) => getStringFromNumberByDigits(n, 2)).join(':')}`;
  }

  // if not today, render date
  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth();
  const day = parsedDate.getDay();
  return [year.toString()]
    .concat([month, day].map((n) => getStringFromNumberByDigits(n, 2)))
    .join('/');
}

function getStringFromNumberByDigits(n: number, digits: number): string {
  return n.toLocaleString('en-US', { minimumIntegerDigits: digits, useGrouping: false });
}

const styles: Record<string, CSSProperties> = {
  background: {
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '80%',
    maxWidth: 1620,
    maxHeight: 985,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 32,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.PRIMARY,
  },

  // header
  header: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: 102,
  },
  configButton: {
    width: 180,
    height: 42,
  },

  // content
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexShrink: 0,
    flexGrow: 1,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 12,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.SECONDARY,
  },
  contentHeader: {
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: 80,
  },
  account: {
    height: 30,
  },
  contentMain: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexGrow: 1,
    overflow: 'hidden',
  },
  contentHeaderRow: {
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 6,
    paddingRight: 6,
  },
  column1: {
    display: 'flex',
    flex: 3,
    paddingLeft: 6,
  },
  column2: {
    display: 'flex',
    flex: 1,
  },
  columnTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ZThemedColors.SECONDARY_TEXT,
    overflow: 'hidden',
  },
  contentScroll: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    width: '100%',
    height: '50vh',
    maxHeight: 500,
    overflow: 'scroll',
  },

  // projectRow
  projectRow: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    width: '100%',
    height: 76,
    cursor: 'pointer',
    paddingLeft: 6,
    paddingRight: 6,
  },
  selectedProjectRow: {
    backgroundColor: ZThemedColors.PRIMARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  rowSeparator: {
    display: 'flex',
    flexShrink: 0,
    width: '100%',
    height: 1,
    backgroundColor: ZThemedColors.PRIMARY,
    marginBottom: -1,
  },
  rowContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  projectRowText: {
    color: ZColors.WHITE,
    fontSize: 15,
    lineHeight: 3,
  },
};
