
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
      
      delete value['normal_icon'];
      if (value['normal_icon_id'] && isString(value['normal_icon_id']) && !isId(value['normal_icon_id'])) {
        const media = await processMedia(value['normal_icon_id'], MediaType.IMAGE) as {id: string, downloadUrl: string};
        value['normal_icon_id'] = media.id;
      }

      delete value['selected_icon'];
      if (value['selected_icon_id'] && isString(value['selected_icon_id']) && !isId(value['selected_icon_id'])) {
        const media = await processMedia(value['selected_icon_id'], MediaType.IMAGE) as {id: string, downloadUrl: string};
        value['selected_icon_id'] = media.id;
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
    
      if (value['normal_icon_id'] && isString(value['normal_icon_id']) && !isId(value['normal_icon_id'])) {
        const result = await validateMedia(value['normal_icon_id']);
        if (!result) throw Error('validateMediaError');
      }

      if (value['selected_icon_id'] && isString(value['selected_icon_id']) && !isId(value['selected_icon_id'])) {
        const result = await validateMedia(value['selected_icon_id']);
        if (!result) throw Error('validateMediaError');
      }
  }

  const getPermission = async () => {
    const result = await (window as any).showDirectoryPicker();
    setHandler(result);
  }

  const dynamicTyping = (columnName: string) => {
    if (_.includes(["name","status"], columnName))
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
      downloadCSV(`${BOM}${csv}`, 'category');
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
      
      
      const CategoryFilter = (props: any) => (
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
<TextInput source="name">

</TextInput>
<TextInput source="status">

</TextInput>

        <NumberInput source="idx_≤">

</NumberInput>
        <NumberInput source="idx_≥">

</NumberInput>
    
        </Filter>
      )
    
      
      export const CategoryList = (props:any) => (
        <List empty={false} {...props} hasEdit={true} hasList={true} 
          hasCreate={true} pagination={<Pagination 
          rowsPerPageOptions={[5, 10, 25, 50, 100]} />} perPage={50} actions={< ListActions />} 
          bulkActionButtons={< ListBulkActions />} filters={<CategoryFilter />}
        >
          <Datagrid expand={<CategoryShow />} >
            <NumberField source="id">

</NumberField>
<FunctionField render={(record: any) => record.trigger_arg ?
              <pre>{JSON.stringify(record.trigger_arg, null, 2)}</pre> : <></>} source="trigger_arg">

</FunctionField>
<DateField showTime={true} source="created_at">

</DateField>
<DateField showTime={true} source="updated_at">

</DateField>
<TextField source="name">

</TextField>
<TextField source="status">

</TextField>
<ImageField source="normal_icon.url">

</ImageField>
<ImageField source="selected_icon.url">

</ImageField>
<NumberField source="idx">

</NumberField>
            <EditButton />
          </Datagrid>
        </List>
      );
    
      
      export const CategoryEdit = (props:any) => (
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
<RichTextInput component="pre" multiline="true" source="name">

</RichTextInput>
<RichTextInput component="pre" multiline="true" source="status">

</RichTextInput>
<ImageInput accept="image/*" source="normal_icon">
<ImageField source="url">

</ImageField>
</ImageInput>
<ImageInput accept="image/*" source="selected_icon">
<ImageField source="url">

</ImageField>
</ImageInput>
<NumberInput source="idx">

</NumberInput>
      <ReferenceArrayInput label="product" source="product" reference="product">
<SelectArrayInput allowEmpty={true} optionText="id">

</SelectArrayInput>
</ReferenceArrayInput>
<ReferenceArrayInput label="business" source="business" reference="business">
<SelectArrayInput allowEmpty={true} optionText="id">

</SelectArrayInput>
</ReferenceArrayInput>
    
          </SimpleForm>
        </Edit>
      );
    
      
      export const CategoryCreate = (props:any) => (
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
<RichTextInput component="pre" multiline="true" source="name">

</RichTextInput>
<RichTextInput component="pre" multiline="true" source="status">

</RichTextInput>
<ImageInput accept="image/*" source="normal_icon">
<ImageField source="url">

</ImageField>
</ImageInput>
<ImageInput accept="image/*" source="selected_icon">
<ImageField source="url">

</ImageField>
</ImageInput>
<NumberInput source="idx">

</NumberInput>
          </SimpleForm>
        </Create>
      );
    
      
      export const CategoryShow = (props:any) => (
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
<TextField source="name">

</TextField>
<TextField source="status">

</TextField>
<ImageField source="normal_icon.url">

</ImageField>
<ImageField source="selected_icon.url">

</ImageField>
<NumberField source="idx">

</NumberField>
      <ReferenceManyField label="product" target="category_category" reference="product">
<SingleFieldList linkType="show">
<ChipField source="id">

</ChipField>
</SingleFieldList>
</ReferenceManyField>
<ReferenceManyField label="business" target="category_category" reference="business">
<SingleFieldList linkType="show">
<ChipField source="id">

</ChipField>
</SingleFieldList>
</ReferenceManyField>
    
          </SimpleShowLayout>
        </Show>
      );
    
    