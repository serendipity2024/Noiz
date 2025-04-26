import { gql } from '@apollo/client';
import { SUB_SYSTEM_RECORD, MAPPING_INFO_RECORD } from './fragments/subsystemFragment';

const SUPPORTED_SUBSYSTEMS = gql`
  query SupportedSubsystems {
    supportedSubsystems {
      subsystemType
      providedTables
      requiredTables {
        name
        requiredColumns {
          name
          type
        }
      }
      optionalTables {
        name
        optionalColumns {
          name
          type
          optional
        }
      }
      miscSettings {
        name
        type
      }
      optionalMappings {
        ...MappingInfoFragment
      }
      pluginInfo {
        pluginType
        providedTables
        requiredTables {
          name
          requiredColumns {
            name
            type
          }
        }
        optionalTables {
          name
          optionalColumns {
            name
            type
            optional
          }
        }
        optionalMappings {
          ...MappingInfoFragment
        }
        miscSettings {
          name
          type
        }
      }
    }
  }
  ${MAPPING_INFO_RECORD}
`;

const ENABLE_SUBSYSTEM = gql`
  mutation EnableSubsystem($projectExId: String!, $config: SubsystemConfigInput!) {
    enableSubsystem(projectExId: $projectExId, config: $config) {
      ...SubsystemFragment
      dataModel
    }
  }
  ${SUB_SYSTEM_RECORD}
`;

export { SUPPORTED_SUBSYSTEMS, ENABLE_SUBSYSTEM };
