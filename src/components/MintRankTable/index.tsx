import React, {useEffect, useState} from 'react';
import './index.less';
import TitleBottom from '@/assets/discover/title-bottom.svg';
import TabsComponent from "@/components/TabsComponent";
import {FormattedMessage, history, useIntl} from 'umi';
import LoadingBlock from "@/components/LoadingBlock";
import NoResult from "@/components/NoResult";
import ProgressBlock from "@/components/ProgressBlock";
import {getMintDataRequest} from "@/services/http/api/api";
import {Pagination} from "antd";

interface DataType {
  key: number;
  tick: string;
  mints: number;
  holders: number;
  progress: number;
}

type Props = {
  blockHeight: number
}

const MintRankTable = ({blockHeight}: Props) => {
  const intl = useIntl();
  const totalT = intl.formatMessage({
    id: 'index.tick.brc20.detail.Total',
  })

  const [changeBlock, setChangeBlock] = useState(blockHeight);

  const tabs = [
    {key: 0, value: '1 block', data: '1b'},
    {key: 1, value: '3 blocks', data: '3b'},
    {key: 2, value: '10 blocks', data: '10b'},
    {key: 3, value: '1D', data: '1d'},
    {key: 4, value: '3D', data: '3d'},
    {key: 5, value: '7D', data: '7d'},
  ];
  const [activeTab, setActiveTab] = useState(0);

  const tabHeader = [
    intl.formatMessage({
      id: 'home.rank.header.TICK',
    }), intl.formatMessage({
      id: 'home.rank.header.MINTS',
    }), intl.formatMessage({
      id: 'home.rank.header.HOLDERS',
    }), intl.formatMessage({
      id: 'home.rank.header.PROGRESS',
    }), ''];

  const [tableData, setTableData] = useState<DataType[]>([]);

  // 切换tab
  const switchTab = (item: any) => {
    setActiveTab(item.key);
  }

  const goMintPage = (item: DataType) => {
    if (item.progress >= 100) return;
    history.push(`/inscribe?tick=${item.tick}`);
  }

  // 分页信息
  const [current, setCurrent] = useState(1);
  const [totalSize, setTotalSize] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const getMintData = (page: number, pageSize: number) => {
    if (loading) return;
    if (changeBlock !== blockHeight) {
      setChangeBlock(blockHeight);
    } else {
      setLoading(true);
    }
    setCurrent(page);
    // 接口
    getMintDataRequest({
      tab: tabs[activeTab].data,
      page,
      pageSize
    }).then((res) => {
      let arr: DataType[] = [];
      res.data.results.map((item: any, index: number) => {
        arr.push({
          key: index,
          tick: item.ticker,
          mints: Number(Number(item.mint_count).toFixed(0)),
          holders: item.holders,
          progress: Number(((Number(Number(item.minted_supply).toFixed(0)) / Number(Number(item.max_supply).toFixed(0))) * 100).toFixed(2))
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
    getMintData(1, 20);
  }, [activeTab, blockHeight]);

  return (
    <div className={'mintRankTable'}>
      <div className={'mintRankTable-header'}>
        <div className={'title'}>
          <FormattedMessage id="home.rank.header.title"/>
          <img src={TitleBottom} className={'titleBottom'}/>
        </div>
        <TabsComponent tabs={tabs} activeTab={activeTab} switchTab={switchTab}/>
      </div>
      <div className={'mintRankTable-table'}>
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
                      <div className={'tick'} onClick={() => history.push(`/index/tick?tick=${item.tick}`)}>
                        {item.tick}
                      </div>
                      <div className={'mints'}>{item.mints}</div>
                      <div className={'holders'}>{item.holders}</div>
                      <div className={'progress'}>
                        <ProgressBlock value={item.progress}/>
                      </div>
                      <div className={'mintBtn'} onClick={() => goMintPage(item)}>
                        <div className={item.progress < 100 ? 'onMint Mint' : 'Mint'}><FormattedMessage
                          id="home.rank.content.mint"/></div>
                      </div>
                    </div>
                  ))
                  :
                  <NoResult/>
                :
                <LoadingBlock loading={loading}/>
            }

          </div>
          <div className={'table-bottom'}>
            <div className={'table-bottom-block'}>
              <FormattedMessage id="home.rank.footer.CurrentBlock"/> #:{blockHeight}
            </div>
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
              onChange={(page, pageSize) => getMintData(page, pageSize)}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </>
      }
    </div>
  )
};

export default MintRankTable;
