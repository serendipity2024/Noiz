import React from "react";
import { useQuery, gql } from '@apollo/client';
import { Button } from '@material-ui/core';
import Config from '../config.js';

interface Props {
  view: string;
  ids: (string | number)[];
}

const 婺阳优选 = {
  projectExId: 'rmLyJ0Z6AjK',
  gql: gql`query Orders($ids: [bigint!]!) {
    order(where: {id: {_in: $ids}}) {
      id
      consignee
      phone_number
      address
      delivery_time
      total_price
      purchase_products {
        name
        current_price
        amount
      }
    }
  }`,
  view: 'order',
  render: (records: any) => `
    <html>
    <head>
    <style>
      dl.order {
        display: grid;
        grid-template-columns: max-content auto;
      }
      dl.order > dt {
        grid-column-start: 1;
      }
      dl.order > dd {
        grid-column-start: 2;
      }
    </style>
    </head>
    <body>
    <div>
    ${records.order.map((record: any) => (`
      <div style="page-break-after: always;">
        <dl class="order">
          <dt>订单号</dt><dd>${record.id}</dd>
          <dt>收货人</dt><dd>${record.consignee}</dd>
          <dt>联系方式</dt><dd>${record.phone_number}</dd>
          <dt>送达时间</dt><dd><time datetime="${record.delivery_time}">${new Date(record.delivery_time).toLocaleString()}</time></dd>
          <dt>收货地址</dt><dd><address>${record.address}</address></dd>
          <dt>订单总额</dt><dd>${record.total_price}元</dd>
        </dl>
        <label>商品信息</label>
        <dl>
          ${record.purchase_products.map((product: any) => (`
            <dt>${product.name}</dt>
            <dd>商品价格：${product.current_price}元</dd>
            <dd>商品数量：${product.amount}</dd>
          `)).join('')}
        </dl>
      </div>
    `)).join('')}
    </div>
    </body>
    </html>
  `
}

export default function PrintRecords(props: Props) {
  const { view, ids } = props;
  const projectExId = Config.webPathPrefix.match(/\/mc\/(.*?)$/)?.[1] ?? '';

  const { data: 婺阳优选Data } = useQuery(婺阳优选.gql, {
    variables: {
      ids
    },
    skip: projectExId !== 婺阳优选.projectExId || view !== 婺阳优选.view || ids.length === 0,
  });

  if (projectExId === 婺阳优选.projectExId && view === 婺阳优选.view && 婺阳优选Data)
    return (
      <>
        <Button onClick={() => { 
          const newWindow = window.open('', 'PRINT');
          newWindow?.document.write(婺阳优选.render(婺阳优选Data));
          newWindow?.document.close();
          newWindow?.focus();
          newWindow?.print();
        }}>打印订单</Button>
      </>
    );
  else return <></>;
}