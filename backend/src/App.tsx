
      import React from 'react'
import { Admin, Resource, Layout } from 'react-admin'
import polyglotI18nProvider from 'ra-i18n-polyglot'
import englishMessages from 'ra-language-english'
import hasuraDataProvider from 'ra-data-hasura'
import config from './config.js'
import i18n from './i18n'
import { i18n as csvI18N } from 'react-admin-import-csv'
import buildDataProvider from './data-provider/index'
import buildAuthProvider from './auth-provider/index'
import createApolloClient from './data-provider/CreateApolloClient'
import { ApolloProvider } from '@apollo/client'
import { resolveBrowserLocale } from 'ra-core'
import CustomAppBar from './ra-component/CustomAppBar'
import { AccountList, AccountEdit, AccountCreate, AccountShow } from './AccountView'
import { Fz_provinceList, Fz_provinceEdit, Fz_provinceCreate, Fz_provinceShow } from './Fz_provinceView'
import { Fz_cityList, Fz_cityEdit, Fz_cityCreate, Fz_cityShow } from './Fz_cityView'
import { Fz_districtList, Fz_districtEdit, Fz_districtCreate, Fz_districtShow } from './Fz_districtView'
import { Fz_audit_recordList, Fz_audit_recordEdit, Fz_audit_recordCreate, Fz_audit_recordShow } from './Fz_audit_recordView'
import { CustomList, CustomEdit, CustomCreate, CustomShow } from './CustomView'
import { NewsList, NewsEdit, NewsCreate, NewsShow } from './NewsView'
import { BannerList, BannerEdit, BannerCreate, BannerShow } from './BannerView'
import { Image_storageList, Image_storageEdit, Image_storageCreate, Image_storageShow } from './Image_storageView'
import { ProductList, ProductEdit, ProductCreate, ProductShow } from './ProductView'
import { TagList, TagEdit, TagCreate, TagShow } from './TagView'
import { CategoryList, CategoryEdit, CategoryCreate, CategoryShow } from './CategoryView'
import { BusinessList, BusinessEdit, BusinessCreate, BusinessShow } from './BusinessView'
      const chineseMessages = require('ra-language-chinese');
      export default function app() {
        const authorityAndPath = `${config.host}${config.apiPath}`;
        const authProvider = buildAuthProvider({
          ssl: config.ssl,
          authorityAndPath
        });

        const messages: Record<string, any> = {
          en: { ...englishMessages, ...csvI18N.en, ...i18n.en},
          zh: { ...chineseMessages, ...csvI18N.zh, ...i18n.zh},
        }
        const i18nProvider = polyglotI18nProvider(locale => messages[locale], resolveBrowserLocale());

        const client = createApolloClient(
          `${config.ssl ? 'https' : 'http'}://${authorityAndPath}`,
          `${config.ssl ? 'wss' : 'ws'}://${authorityAndPath}`,
          localStorage.getItem('token')!,
        );

        const CustomLayout = (props: any) => <Layout {...props} appBar={CustomAppBar} />;

        return (
          <ApolloProvider client={client}>
            <Admin layout={CustomLayout} dataProvider={buildDataProvider(client)} 
                authProvider={authProvider} i18nProvider={i18nProvider}>
              
        <Resource 
          name="account" 
          list={AccountList} 
          edit={AccountEdit} 
          create={AccountCreate} 
          show={AccountShow}
        />

        <Resource 
          name="banner" 
          list={BannerList} 
          edit={BannerEdit} 
          create={BannerCreate} 
          show={BannerShow}
        />

        <Resource 
          name="business" 
          list={BusinessList} 
          edit={BusinessEdit} 
          create={BusinessCreate} 
          show={BusinessShow}
        />

        <Resource 
          name="category" 
          list={CategoryList} 
          edit={CategoryEdit} 
          create={CategoryCreate} 
          show={CategoryShow}
        />

        <Resource 
          name="custom" 
          list={CustomList} 
          edit={CustomEdit} 
          create={CustomCreate} 
          show={CustomShow}
        />

      <Resource 
        name="fz_audit_record" 
        list={Fz_audit_recordList} 
        show={Fz_audit_recordShow}
      />

        <Resource 
          name="fz_city" 
          list={Fz_cityList} 
          edit={Fz_cityEdit} 
          create={Fz_cityCreate} 
          show={Fz_cityShow}
        />

      <Resource 
        name="fz_district" 
        list={Fz_districtList} 
        show={Fz_districtShow}
      />

        <Resource 
          name="fz_province" 
          list={Fz_provinceList} 
          edit={Fz_provinceEdit} 
          create={Fz_provinceCreate} 
          show={Fz_provinceShow}
        />

        <Resource 
          name="image_storage" 
          list={Image_storageList} 
          edit={Image_storageEdit} 
          create={Image_storageCreate} 
          show={Image_storageShow}
        />

        <Resource 
          name="news" 
          list={NewsList} 
          edit={NewsEdit} 
          create={NewsCreate} 
          show={NewsShow}
        />

        <Resource 
          name="product" 
          list={ProductList} 
          edit={ProductEdit} 
          create={ProductCreate} 
          show={ProductShow}
        />

        <Resource 
          name="tag" 
          list={TagList} 
          edit={TagEdit} 
          create={TagCreate} 
          show={TagShow}
        />
            </Admin>
          </ApolloProvider>
        );
      }
    