/* eslint-disable import/no-default-export */
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import useStores from '../hooks/useStores';
import { NullableReactElement } from '../shared/type-definition/ZTypes';
import GQL_GET_PROJECT_SCHEMA_BY_EX_ID from '../graphQL/getProjectSchemaByExId';
import { GetProjectSchemaByExId } from '../graphQL/__generated__/GetProjectSchemaByExId';

function DownloadSchemaJson(): NullableReactElement {
  const history = useHistory();
  const location = useLocation();
  const client = useApolloClient();
  const { coreStore } = useStores();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const projectExId = params.get('projectExId');
    const schemaExId = params.get('schemaExId');
    const fileName = params.get('fileName') || 'schema';

    if (!projectExId || !schemaExId) {
      history.push('/');
      return;
    }

    const downloadSchema = async () => {
      try {
        const { data } = await client.query<GetProjectSchemaByExId>({
          query: GQL_GET_PROJECT_SCHEMA_BY_EX_ID,
          variables: {
            projectExId,
            schemaExId,
          },
        });

        const appSchema = data?.project?.projectSchema?.appSchema;
        if (appSchema) {
          coreStore.exportAppSchema(appSchema, fileName);
          // Redirect back after download
          setTimeout(() => {
            history.push('/');
          }, 1000);
        } else {
          history.push('/');
        }
      } catch (error) {
        console.error('Error downloading schema:', error);
        history.push('/');
      }
    };

    downloadSchema();
  }, [client, coreStore, history, location.search]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2>Downloading Schema...</h2>
        <p>Your download should start automatically.</p>
        <p>If not, you will be redirected to the home page.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f0f2f5',
  },
  content: {
    textAlign: 'center' as const,
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
};

export default DownloadSchemaJson;