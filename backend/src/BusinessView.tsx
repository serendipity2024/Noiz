
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
      
      delete value['cover_image'];
      if (value['cover_image_id'] && isString(value['cover_image_id']) && !isId(value['cover_image_id'])) {
        const media = await processMedia(value['cover_image_id'], MediaType.IMAGE) as {id: string, downloadUrl: string};
        value['cover_image_id'] = media.id;
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
    
      if (value['cover_image_id'] && isString(value['cover_image_id']) && !isId(value['cover_image_id'])) {
        const result = await validateMedia(value['cover_image_id']);
        if (!result) throw Error('validateMediaError');
      }
  }

  const getPermission = async () => {
    const result = await (window as any).showDirectoryPicker();
    setHandler(result);
  }

  const dynamicTyping = (columnName: string) => {
    if (_.includes(["status"], columnName))
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
      downloadCSV(`${BOM}${csv}`, 'business');
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
      
      
      const BusinessFilter = (props: any) => (
        <Filter {...props}>
          
      
        <NumberInput source="id_≤">

</NumberInput>
        <NumberInput source="id_≥">

</NumberInput>

        <DateTimeInput source="created_at_≤">

</DateTimeInput>
        <DateTimeInput source="created_at_≥">

</DateTimeInput>

        <DateTimeInput source="updated_at_≤">

</DateTimeInput>
        <DateTimeInput source="updated_at_≥">

</DateTimeInput>
<TextInput source="status">

</TextInput>

        <NumberInput source="category_category_≤">

</NumberInput>
        <NumberInput source="category_category_≥">

</NumberInput>
    
        </Filter>
      )
    
      
      export const BusinessList = (props:any) => (
        <List empty={false} {...props} hasEdit={true} hasList={true} 
          hasCreate={true} pagination={<Pagination 
          rowsPerPageOptions={[5, 10, 25, 50, 100]} />} perPage={50} actions={< ListActions />} 
          bulkActionButtons={< ListBulkActions />} filters={<BusinessFilter />}
        >
          <Datagrid expand={<BusinessShow />} >
            <NumberField source="id">

</NumberField>
<FunctionField render={(record: any) => record.trigger_arg ?
              <pre>{JSON.stringify(record.trigger_arg, null, 2)}</pre> : <></>} source="trigger_arg">

</FunctionField>
<DateField showTime={true} source="created_at">

</DateField>
<DateField showTime={true} source="updated_at">

</DateField>
<TextField source="status">

</TextField>
<ImageField source="cover_image.url">

</ImageField>
<ReferenceField label="category" source="category_category" reference="category" link="show">
<ChipField source="id">

</ChipField>
</ReferenceField>
            <EditButton />
          </Datagrid>
        </List>
      );
    
      
      export const BusinessEdit = (props:any) => (
        <Edit title='edit' undoable={false} {...props}>
          <SimpleForm>
            
      <NumberInput source="id" disabled={true}>

</NumberInput>
<TextInput multiline="true" source="trigger_arg">

</TextInput>
<DateTimeInput source="created_at">

</DateTimeInput>
<DateTimeInput source="updated_at">

</DateTimeInput>
<RichTextInput component="pre" multiline="true" source="status">

</RichTextInput>
<ImageInput accept="image/*" source="cover_image">
<ImageField source="url">

</ImageField>
</ImageInput>
<ReferenceInput label="category" source="category_category" reference="category" allowEmpty={true}>
<AutocompleteInput optionText="id" matchSuggestion={() => true}>

</AutocompleteInput>
</ReferenceInput>
      <ReferenceArrayInput label="tags" source="tags" reference="tag">
<SelectArrayInput allowEmpty={true} optionText="id">

</SelectArrayInput>
</ReferenceArrayInput>
    
          </SimpleForm>
        </Edit>
      );
    
      
      export const BusinessCreate = (props:any) => (
        <Create {...props}>
          <SimpleForm>
            <NumberInput source="id" disabled={true}>

</NumberInput>
<TextInput multiline="true" source="trigger_arg">

</TextInput>
<DateTimeInput source="created_at">

</DateTimeInput>
<DateTimeInput source="updated_at">

</DateTimeInput>
<RichTextInput component="pre" multiline="true" source="status">

</RichTextInput>
<ImageInput accept="image/*" source="cover_image">
<ImageField source="url">

</ImageField>
</ImageInput>
<ReferenceInput label="category" source="category_category" reference="category" allowEmpty={true}>
<AutocompleteInput optionText="id" matchSuggestion={() => true}>

</AutocompleteInput>
</ReferenceInput>
          </SimpleForm>
        </Create>
      );
    
      
      export const BusinessShow = (props:any) => (
        <Show {...props}>
          <SimpleShowLayout>
            
      <NumberField source="id">

</NumberField>
<FunctionField render={(record: any) => record.trigger_arg ?
              <pre>{JSON.stringify(record.trigger_arg, null, 2)}</pre> : <></>} source="trigger_arg">

</FunctionField>
<DateField showTime={true} source="created_at">

</DateField>
<DateField showTime={true} source="updated_at">

</DateField>
<TextField source="status">

</TextField>
<ImageField source="cover_image.url">

</ImageField>
<ReferenceField label="category" source="category_category" reference="category" link="show">
<ChipField source="id">

</ChipField>
</ReferenceField>
      <ReferenceManyField label="tags" target="business_business" reference="tag">
<SingleFieldList linkType="show">
<ChipField source="id">

</ChipField>
</SingleFieldList>
</ReferenceManyField>
    
          </SimpleShowLayout>
        </Show>
      );
    
    