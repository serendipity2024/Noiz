
      import React from 'react'
import { useState, cloneElement } from 'react'
import { Button, Show, ShowButton, SimpleShowLayout, DateField, DateInput, DateTimeInput, BooleanField, BooleanInput, TopToolbar, Edit, ImageField, ImageInput, FileInput, FileField, NumberField, NumberInput, ReferenceField, ReferenceInput, AutocompleteInput, ReferenceArrayInput, SelectArrayInput, AutocompleteArrayInput, ReferenceArrayField, ReferenceManyField, SingleFieldList, ChipField, Create, List, Datagrid, TextField, FunctionField, EditButton, SearchInput, SimpleForm, TextInput, Filter, Pagination, BulkDeleteButton, useNotify, useListContext, downloadCSV, sanitizeListRestProps } from 'react-admin'
import { CreateButton, ExportButton } from 'ra-ui-materialui'
import { makeStyles, Chip } from '@material-ui/core'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import { ImportButton } from 'react-admin-import-csv'
import ImageListField from './ra-component/ImageListField'
import VideoField from './ra-component/VideoField'
import VideoInput from './ra-component/VideoInput'
import TimeField from './ra-component/TimeField'
import TimeInput from './ra-component/TimeInput'
import { isString, isArray } from 'lodash'
import { MediaType } from './data-provider/type-definition/DataModel'
import uploadImage from './data-provider/uploadUtils'
import { uploadImages, uploadVideo, uploadFile } from './data-provider/uploadUtils'
import { useApolloClient } from '@apollo/client'
import { isId } from './utils'
import jsonExport from 'jsonexport/dist'
import _ from 'lodash'
import PrintRecords from './custom-actions/PrintRecords'
import RichTextInput from './ra-component/RichTextInput'
      
const ListActions = (props: any) => {
  const {
    className,
    exporter,
    filters,
    ...rest
  } = props;

  const {
    resource,
    currentSort,
    basePath,
    total,
    showFilter,
    displayedFilters,
    filterValues,
  } = useListContext();

  const client = useApolloClient();
  const notify = useNotify();
  const [handler, setHandler] = useState<any>();

  const processMedia = async (filename: string | string[], type: MediaType) => {
    if (!isArray(filename)) {
      const fileHandle = await handler.getFileHandle(filename);
      const file = await fileHandle.getFile();
      let uploadFunc;
      switch (type) {
        case MediaType.IMAGE:
          uploadFunc = uploadImage;
          break;
        case MediaType.VIDEO:
          uploadFunc = uploadVideo;
          break;
        default:
          uploadFunc = uploadFile;
          break;
      }
      return await uploadFunc(client, file) as { id: string, downloadUrl: string };
    }
    const fileHandles = await Promise.all(filename.map(file => handler.getFileHandle(file)));
    const files = await Promise.all(fileHandles.map(handle => handle.getFile()))
    return await uploadImages(client, files) as { id: string, downloadUrl: string }[];
  }
  
  const preCommitCallback = async (action: 'create' | 'overwrite', values: any[]) => {
    const rows = await Promise.all(values.map(async value => {
      delete value['__typename'];
      if (action === 'create') {
        delete value['id'];
      }
      
      return value;
    }))
    return rows.filter(row => Object.entries(row).filter(([key, value]) => !!value).length !== 0);
  }

  const validateMedia = async (filename: string | string[]) => {
    try {
      if (!isArray(filename)) {
        const fileHandle = await handler.getFileHandle(filename);
        const file = await fileHandle.getFile();
      } else {
        const fileHandles = await Promise.all(filename.map(file => handler.getFileHandle(file)));
        const files = await Promise.all(fileHandles.map(handle => handle.getFile()))
      }
    } catch (exception) {
      notify('fz.notify.validateMediaError', 'error', {filename: filename});
      return false;
    }
    
    return true;
  }

  const validateRow = async (value: any) => {
    
  }

  const getPermission = async () => {
    const result = await (window as any).showDirectoryPicker();
    setHandler(result);
  }

  const dynamicTyping = (columnName: string) => {
    if (_.includes(["name"], columnName))
      return false;
    return true;
  }

  const customExporter = (posts: any[]) => {
    const filteredPosts = posts.map(post => {
      function isMediaColumn(column: any): column is {id: any, url: any, __typename: any} {
        return column.id && column.url && column.__typename;
      }
      const filteredPost = _(post).toPairs().map(([key, value]) => {
        let result = [key, value];
        if (_.isArray(value)) {
          result = [key, _.filter(value, _.negate(isMediaColumn))];
        }
        else if (_.isObject(value) && isMediaColumn(value)) {
          result = [];
        }
        if (key === '__typename')
          result = [];
        return result;
      }).filter(_.negate(_.isEmpty)).fromPairs().value();
      return filteredPost;
    });
    jsonExport(filteredPosts, (err, csv) => {
      const BOM = '\uFEFF';
      downloadCSV(`${BOM}${csv}`, 'fz_province');
    });
  }

  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
    {filters && cloneElement(filters, {
      resource,
      showFilter,
      displayedFilters,
      filterValues,
      context: 'button',
    })}
      <CreateButton basePath={basePath} />
      <ExportButton
        disabled={total === 0}
        maxResults={10000}
        resource={resource}
        sort={currentSort}
        filter={filterValues}
        exporter={customExporter}
      />
      <ImportButton {...props} logging 
    parseConfig={{header: true, dynamicTyping: dynamicTyping}} 
    preCommitCallback={preCommitCallback}
    validateRow={validateRow} />
      <Button color="primary" onClick={getPermission} label="fz.button.authorizeDirectory"><FolderOpenIcon /></Button>
    </TopToolbar>
  );
};
  
      const ListBulkActions = (props: any) => (
        <>
          <PrintRecords view={props.resource} ids={props.selectedIds}/>
          <BulkDeleteButton {...props} />
        </>
      )
      
      
      const Fz_provinceFilter = (props: any) => (
        <Filter {...props}>
          
      
        <NumberInput source="id_≤">

</NumberInput>
        <NumberInput source="id_≥">

</NumberInput>
<TextInput source="name">

</TextInput>
    
        </Filter>
      )
    
      
      export const Fz_provinceList = (props:any) => (
        <List empty={false} {...props} hasEdit={true} hasList={true} 
          hasCreate={true} pagination={<Pagination 
          rowsPerPageOptions={[5, 10, 25, 50, 100]} />} perPage={50} actions={< ListActions />} 
          bulkActionButtons={< ListBulkActions />} filters={<Fz_provinceFilter />}
        >
          <Datagrid expand={<Fz_provinceShow />} >
            <NumberField source="id">

</NumberField>
<TextField source="name">

</TextField>
            <EditButton />
          </Datagrid>
        </List>
      );
    
      
      export const Fz_provinceEdit = (props:any) => (
        <Edit title='edit' undoable={false} {...props}>
          <SimpleForm>
            
      <NumberInput source="id" disabled={true}>

</NumberInput>
<RichTextInput component="pre" multiline="true" source="name">

</RichTextInput>
      
    
          </SimpleForm>
        </Edit>
      );
    
      
      export const Fz_provinceCreate = (props:any) => (
        <Create {...props}>
          <SimpleForm>
            <NumberInput source="id" disabled={true}>

</NumberInput>
<RichTextInput component="pre" multiline="true" source="name">

</RichTextInput>
          </SimpleForm>
        </Create>
      );
    
      
      export const Fz_provinceShow = (props:any) => (
        <Show {...props}>
          <SimpleShowLayout>
            
      <NumberField source="id">

</NumberField>
<TextField source="name">

</TextField>
      
    
          </SimpleShowLayout>
        </Show>
      );
    
    