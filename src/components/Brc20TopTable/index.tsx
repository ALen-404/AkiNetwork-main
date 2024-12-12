import React, {useEffect, useState} from 'react';
import {Pagination} from 'antd';
import './index.less';
import {history, useIntl} from 'umi';
import {shortAddress} from "@/utils/utils";
import formate from "@/utils/formattedDate";
import LoadingBlock from "@/components/LoadingBlock";
import NoResult from "@/components/NoResult";
import ProgressBlock from "@/components/ProgressBlock";
import {getIndexTableData} from "@/services/http/api/api";

interface DataType {
  id: string;
  tick: string;
  maxSupply: number;
  mintedSupply: number;
  address: string;
  txCount: number;
  dateTime: number;
  holders: number;
  progress: number;
}

const Brc20TopTable: React.FC = () => {

  const intl = useIntl();

  const totalT = intl.formatMessage({
    id: 'index.tick.brc20.detail.Total',
  })

  const tabHeader = [
    intl.formatMessage({
      id: 'index.brc20.table.header.TICK',
    }), intl.formatMessage({
      id: 'index.brc20.table.header.MAX SUPPLY',
    }), intl.formatMessage({
      id: 'index.brc20.table.header.MINTED SUPPLY',
    }), intl.formatMessage({
      id: 'index.brc20.table.header.SUPPLY',
    }), intl.formatMessage({
      id: 'index.brc20.table.header.ADDRESS',
    }), intl.formatMessage({
      id: 'index.brc20.table.header.TX COUNT',
    }), intl.formatMessage({
      id: 'index.brc20.table.header.HOLDERS',
    }), intl.formatMessage({
      id: 'index.brc20.table.header.DEPLOY TIME',
    })];
  const [tableData, setTableData] = useState<DataType[]>([]);

  // 分页信息
  const [current, setCurrent] = useState(1);
  const [totalSize, setTotalSize] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const getTabData = (page: number, pageSize: number) => {
    setCurrent(page);
    if (loading) return;
    setLoading(true);
    getIndexTableData({page, pageSize}).then((res) => {
      let arr: DataType[] = [];
      res.data.results.map((item: any, index: number) => {
        arr.push({
          id: item.id,
          tick: item.ticker,
          holders: item.holders,
          progress: Number(((Number(Number(item.minted_supply).toFixed(0)) / Number(Number(item.max_supply).toFixed(0))) * 100).toFixed(2)),
          maxSupply: Number(item.max_supply),
          mintedSupply: Number(item.minted_supply),
          address: item.address,
          txCount: item.tx_count,
          dateTime: item.deploy_timestamp / 1000
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
  }, [])

  return (
    <div className={'Brc20TopTable'}>
      <div className={'Brc20TopTable-header'}>
        <div className={'title'}>
          {/*Top*/}
          {/*<img src={TitleBottom} className={'titleBottom'}/>*/}
        </div>
      </div>
      <div className={'Brc20TopTable-table'}>
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
                      <div className={'tick'}
                           onClick={() => history.push(`/index/tick?tick=${item.tick}`)}>{item.tick}</div>
                      <div className={'maxSupply'}>{item.maxSupply}</div>
                      <div className={'mintedSupply'}>{item.mintedSupply}</div>
                      <div className={'progress'}>
                        <ProgressBlock value={item.progress}/>
                      </div>
                      <div className={'address'}>{shortAddress(item.address)}</div>
                      <div className={'txCount'}>{item.txCount}</div>
                      <div className={'holders'}>{item.holders}</div>
                      <div className={'dateTime'}>{formate(item.dateTime, 'hour')}</div>
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
                onChange={(page, pageSize) => getTabData(page, pageSize)}
                showSizeChanger={false}
                showQuickJumper
              />
            </div>
          </>
      }
    </div>
  )
};

export default Brc20TopTable;
