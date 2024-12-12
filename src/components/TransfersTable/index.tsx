import React, {useEffect, useState} from 'react';
import {Pagination} from 'antd';
import './index.less';
import TabsComponent from "@/components/TabsComponent";
import {useIntl} from 'umi';
import {getAmount, getTransferFrom, shortAddress, shortString} from "@/utils/utils";
import formate from "@/utils/formattedDate";
import LoadingBlock from "@/components/LoadingBlock";
import NoResult from "@/components/NoResult";
import {getTransfersTableRequest} from "@/services/http/api/api";

interface DataType {
  id: string;
  method: string,
  amount: number | string,
  from: string,
  to: string,
  dateTime: number,
}

type Props = {
  tick: string | null;
}

const TransfersTable = ({tick}: Props) => {

  const intl = useIntl();

  const totalT = intl.formatMessage({
    id: 'index.tick.brc20.detail.Total',
  })

  const tableTabs = [
    {
      key: 0, value: intl.formatMessage({
        id: 'index.tick.brc20.detail.tableTabs.All',
      }), data: ''
    },
    {
      key: 1, value: intl.formatMessage({
        id: 'index.tick.brc20.detail.tableTabs.Deploy',
      }), data: '&operation=deploy'
    },
    {
      key: 2, value: intl.formatMessage({
        id: 'index.tick.brc20.detail.tableTabs.Mint',
      }), data: '&operation=mint'
    },
    {
      key: 3, value: intl.formatMessage({
        id: 'index.tick.brc20.detail.tableTabs.Transfer',
      }), data: '&operation=transfer'
    },
    {
      key: 4, value: intl.formatMessage({
        id: 'index.tick.brc20.detail.tableTabs.Transfer_send',
      }), data: '&operation=transfer_send'
    },
  ];
  const [activeTableTab, setActiveTableTab] = useState(0);

  // 切换表格tab
  const switchTableTab = (item: any) => {
    setActiveTableTab(item.key);
  }

  // const tabHeader = ['ID', 'METHOD', 'AMOUNT', 'FROM', 'TO', 'DATE TIME'];
  // 表头信息
  const tabHeader = [
    intl.formatMessage({
      id: 'index.tick.brc20.detail.transactions.tabHeader.ID',
    }), intl.formatMessage({
      id: 'index.tick.brc20.detail.transactions.tabHeader.METHOD',
    }), intl.formatMessage({
      id: 'index.tick.brc20.detail.transactions.tabHeader.AMOUNT',
    }), intl.formatMessage({
      id: 'index.tick.brc20.detail.transactions.tabHeader.FROM',
    }), intl.formatMessage({
      id: 'index.tick.brc20.detail.transactions.tabHeader.TO',
    }), intl.formatMessage({
      id: 'index.tick.brc20.detail.transactions.tabHeader.DATETIME',
    })];
  const [tableData, setTableData] = useState<DataType[]>([]);

  // 分页信息
  const [current, setCurrent] = useState(1);
  const [totalSize, setTotalSize] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const getTabData = (page: number, pageSize: number) => {
    if (loading) return;
    setLoading(true);
    setCurrent(page);
    getTransfersTableRequest({
      tick,
      tab: tableTabs[activeTableTab].data,
      page,
      pageSize
    }).then((res) => {
      let arr: DataType[] = [];
      res.data.results.map((item: any) => {
        arr.push({
          id: item.inscription_id,
          method: item.operation,
          amount: getAmount(item.operation, item),
          from: getTransferFrom(item.operation, item),
          to: item.address,
          dateTime: item.timestamp / 1000
        })
      });
      setTableData(arr);
      setTotalSize(res.data.total);
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    getTabData(1, 10);
  }, [activeTableTab])

  return (
    <>
      <div className={'tick-body-right-header'}>
        <div></div>
        <TabsComponent tabs={tableTabs} activeTab={activeTableTab} switchTab={switchTableTab}/>
      </div>

      <div className={'transfersTable'}>
        <div className={'transfersTable-table'}>
          <div className={'tableContent'}>
            <div className={'table-header'}>
              {
                tabHeader.map((item: string, index: number) => (
                  <div key={index} className={'headerText'}>{item}</div>
                ))
              }
            </div>
            <div className={'table-body'}>
              {
                !loading ?
                  tableData.length ?
                    tableData.map((item: DataType, index: number) => (
                      <div key={index} className={index % 2 == 0 ? 'table-body-row' : 'table-body-row even'}>
                        <div className={'id'}>{shortString(item.id)}</div>
                        <div className={'method'}>
                          <div className={'block'} data-value={item.method}>{item.method}</div>
                        </div>
                        <div className={'amount'}>{item.amount}</div>
                        <div className={'from'}>{shortAddress(item.from)}</div>
                        <div className={'to'}>{shortAddress(item.to)}</div>
                        <div className={'dateTime'}>{formate(item.dateTime, 'day')}</div>
                      </div>
                    ))
                    :
                    <NoResult/>
                  :
                  <LoadingBlock loading={loading}/>
              }
            </div>
          </div>
        </div>
        {
        totalSize > 10 && <>
          <div className={'pagination'}>
            <Pagination
              current={current}
              pageSize={pageSize}
              total={totalSize}
              onChange={(page, pageSize) => getTabData(page, pageSize)}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
          </>
        }
      </div>
    </>

  )
};

export default TransfersTable;
