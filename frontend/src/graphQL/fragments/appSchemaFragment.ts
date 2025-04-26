/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';
import GQL_FUNCTOR_FRAGMENT from './functorFragment';
import { SUB_SYSTEM_RECORD } from './subsystemFragment';
import { ACTION_FLOWS } from './actionFlowFragment';

const GQL_PROJECT_SCHEMA_JSON = gql`
  fragment AppSchemaFragment on AppSchema {
    wechatRootMRefs
    webRootMRefs
    mobileWebRootMRefs
    mRefMap
    dataModel
    colorTheme
    appConfiguration
    wechatConfiguration
    webConfiguration
    mobileWebConfiguration
    appGlobalSetting {
      appDidLoad
      globalVariableTable
    }
    zedVersion
    remoteApiSchema
    thirdPartyApiConfigs
    functors {
      ...FunctorFragment
    }
    actionFlows {
      ...actionFlowsFragment
    }
    subsystemRecords {
      ...SubsystemFragment
    }
    mcConfiguration {
      userRoles
      menuItems
      objects
    }
    componentTemplates
  }
  ${GQL_FUNCTOR_FRAGMENT}
  ${SUB_SYSTEM_RECORD}
  ${ACTION_FLOWS}
`;

export default GQL_PROJECT_SCHEMA_JSON;
