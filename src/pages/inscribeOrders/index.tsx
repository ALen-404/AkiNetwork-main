import React, {useEffect, useState} from "react";
import './index.less';
import {connect, FormattedMessage, history, useIntl} from "umi";
import TitleBottom from "@/assets/discover/title-bottom.svg";
import TableComponents from "@/components/TableComponents";
import {getOrderState} from "@/utils/utils";
import formate from "@/utils/formattedDate";
import {Pagination} from "antd";
import OrderModal from "@/components/OrderModal";
import LoadingBlock from "@/components/LoadingBlock";
import NoResult from "@/components/NoResult";
import {getOrderDetails, getOrderListRequest} from "@/services/http/api/mintApi";

type tableType = {
  id: string;
  createdAt: number;
  status: string
}

type Order = {
  id: string,
  clientId: string,
  type: number,
  status: string,
  payAddress: string,
  receiveAddress: string,
  amount: number,
  count: number,
  feeRate: number,
  minerFee: number,
  serviceFee: number,
  exTime: number,
  createdAt: number,
  files?: any[]
}

function Page({address, loginStatus}: any) {
  const intl = useIntl();

  const totalT = intl.formatMessage({
    id: 'index.tick.brc20.detail.Total',
  })

  const [orderArr, setOrderArr] = useState<tableType[]>([]);
  const tabHeader = [
    intl.formatMessage({
      id: 'inscribeOrders.header.orderId',
    }),
    intl.formatMessage({
      id: 'inscribeOrders.header.orderCreateAt',
    }),
    intl.formatMessage({
      id: 'inscribeOrders.header.status',
    }),
  ];

  // 分页信息
  const [current, setCurrent] = useState(1);
  const [totalSize, setTotalSize] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const getOrderList = (page: number, pageSize: number) => {
    if (loading) return;
    setLoading(true);
    setCurrent(page);
    getOrderListRequest({
      address,
      page,
      pageSize
    }).then((res) => {
      setOrderArr(res.data.data.data)
      setTotalSize(res.data.data.total);
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    if (address) {
      getOrderList(current, pageSize);
    }
  }, [address]);

  useEffect(() => {
    if (!loginStatus) {
      history.push('/discover');
    }
  }, [loginStatus]);

  // 弹窗信息
  const [modalOpen, setModalOpen] = useState(false);
  const [orderInfo, setOrderInfo] = useState<Order>();
  const [itemArr, setItemArr] = useState([]);

  const showOrderDetails = (id: string) => {
    getOrderDetails({id}).then((res) => {
      const data = res.data.data;
      setOrderInfo(data);
      setModalOpen(true);
      const arr = data.files.map((item: any) => {
        return item.fileName
      })
      setItemArr(arr)
    }).catch((err) => {
      console.error(err);
    })
  }


  return (
    <div className={'inscribeOrders'}>
      <div className={'title'}>
        <div><FormattedMessage id="inscribeOrders.title"/></div>
        <img src={TitleBottom} className={'titleBottom'}/>
      </div>
      <TableComponents tabHeader={tabHeader}>
        {
          !loading ?
            orderArr ?
              orderArr.map((item: tableType, index: number) => (
                <div
                  key={index}
                  className={index % 2 == 0 ? 'table-body-row' : 'table-body-row even'}
                  onClick={() => showOrderDetails(item.id)}
                >
                  <div className={'orderId'}>{item.id}</div>
                  <div className={'orderCreateAt'}>{formate(item.createdAt / 1000)}</div>
                  <div className={'status'}>
                    <div className={getOrderState(item.status)}>{getOrderState(item.status)}</div>
                  </div>
                </div>
              ))
              :
              <NoResult/>
            :
            <LoadingBlock loading={loading}/>
        }
      </TableComponents>
      {
        totalSize > 10 && <>
          <div className={'pagination'}>
            <Pagination
              current={current}
              pageSize={pageSize}
              total={totalSize}
              onChange={(page, pageSize) => getOrderList(page, pageSize)}
              showQuickJumper
            />
          </div>
        </>
      }

      <OrderModal modelStatus={modalOpen} setModelStatus={setModalOpen} orderInfo={orderInfo} itemArr={itemArr}
                  address={address} sliderValue={itemArr.length}/>
    </div>
  )
}

export default connect(({aki}: any) => ({
  address: aki.address,
  loginStatus: aki.loginStatus
}))(Page);
