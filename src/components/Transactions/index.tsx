import React, {useEffect, useState} from 'react';
import './index.less';
import TitleBottom from '@/assets/discover/title-bottom.svg';
import {changeType, shortAddress} from "@/utils/utils";
import {Pagination} from 'antd';
import formate from '@/utils/formattedDate';
import {FormattedMessage, useIntl} from 'umi';
import LoadingBlock from "@/components/LoadingBlock";
import NoResult from "@/components/NoResult";
import {
  getBlockHeightRequest,
  getImageInfoRequest,
  getTableContentRequest,
  getTableDetailsRequest,
  getTransactionsRequest
} from "@/services/http/api/api";

interface DataType {
  id: string;
  type: string;
  asset: string;
  number: number;
  value: string | number;
  from: string;
  to: string;
  dateTime: number;
  satOrdinal: string;
  satRarity: string;
}

type Props = {
  blockHeight: number
}

const Transactions = ({blockHeight}: Props) => {
  const intl = useIntl();

  // 表头信息
  const tabHeader = [
    intl.formatMessage({
      id: 'home.transactions.header.TYPE',
    }), intl.formatMessage({
      id: 'home.transactions.header.ASSET',
    }), intl.formatMessage({
      id: 'home.transactions.header.NUMBER',
    }), intl.formatMessage({
      id: 'home.transactions.header.SATOTDINAL',
    }), intl.formatMessage({
      id: 'home.transactions.header.SATRARITY',
    }), intl.formatMessage({
      id: 'home.transactions.header.VALUE',
    }), intl.formatMessage({
      id: 'home.transactions.header.FROM',
    }), intl.formatMessage({
      id: 'home.transactions.header.TO',
    }), intl.formatMessage({
      id: 'home.transactions.header.DATETIME',
    })];
  // 表格信息
  const [tableData, setTableData] = useState<DataType[]>([]);

  // 分页信息
  const [current, setCurrent] = useState(1);
  const [totalSize, setTotalSize] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 区块高度发生变化时再请求数据
  useEffect(() => {
    getTransFer();
  }, [blockHeight]);

  const getTransFer = () => {
    if (!blockHeight) return;
    getTransactionsRequest({blockHeight}).then((res) => {
      getTableData(res.data.results)
    }).catch((err) => {
      console.error(err);
    })
  }

  const [loading, setLoading] = useState(false);
  // 获取表格数据
  const getTableData = async (info: any) => {
    if (loading) return;
    setLoading(true)
    let arr: DataType[] = []
    await Promise.all(
      info.map(async (item: any) => {
        const details = await getTableDetails(item.number);
        const type = changeType(details ? details.mime_type : '');
        let content: any = null;
        if (type === 'Image') {
          content = getImageInfoRequest(item.number)
        } else {
          content = await getTableContent(item.number);
        }
        arr.push({
          from: item.from.address,
          to: item.to.address,
          number: item.number,
          id: item.id,
          type,
          satOrdinal: details ? details.sat_ordinal : '',
          satRarity: details ? details.sat_rarity : '',
          value: details ? details.value : '',
          dateTime: details ? details.timestamp / 1000 : 0,
          asset: content,
        })
      })
    )
    setTableData(arr);
    setTotalSize(arr.length)
    setLoading(false);
  }

  const getTableDetails = async (num: number) => {
    try {
      const response = await getTableDetailsRequest({num});
      return response.data;
    } catch (err) {
      console.error(err)
      return null
    }
  }

  const getTableContent = async (num: number) => {
    try {
      const response = await getTableContentRequest({num})
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }


  return (
    <div className={'transactions'}>
      <div className={'transactions-header'}>
        <div className={'title'}>
          <FormattedMessage id="home.transactions.header.title"/>
          <img src={TitleBottom} className={'titleBottom'}/>
        </div>
        {/*<TabsComponent tabs={tabs} activeTab={activeTab} switchTab={switchTab}/>*/}
      </div>
      <div className={'transactions-table'}>
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
                  tableData?.slice((current - 1) * pageSize, pageSize)?.map((item: DataType, index: number) => (
                    <div key={index} className={index % 2 == 0 ? 'table-body-row' : 'table-body-row even'}>
                      <div className={'type'}>{item.type}</div>
                      <div className={'asset'}>
                        {
                          item.type === 'Image' ?
                            <img src={item.asset} className={'img'}/>
                            :
                            item.type === 'Text' ?
                              <div className={'text'}>
                                {typeof item.asset === 'object' ? JSON.stringify(item.asset) : item.asset}
                              </div>
                              :
                              <></>
                        }
                      </div>
                      <div className={'number'}>#{item.number}</div>
                      <div className={'satOrdinal'}>{item.satOrdinal}</div>
                      <div className={'satRarity'}>{item.satRarity}</div>
                      <div className={'value'}>${item.value}</div>
                      <div className={'from'}>{item.from ? shortAddress(item.from) : '--'}</div>
                      <div className={'to'}>{item.to ? shortAddress(item.to) : '--'}</div>
                      <div className={'dateTime'}>{item.dateTime ? formate(item.dateTime, 'second') : ''}</div>
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
        totalSize > 10  &&  <>
            <div className={'pagination'}>
              <Pagination
                current={current}
                pageSize={pageSize}
                total={totalSize}
                onChange={(page) => setCurrent(page)}
                showSizeChanger={false}
                showQuickJumper
              />
            </div>
          </>
      }
    </div>
  )
};

export default Transactions;
