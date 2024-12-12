import React, {useEffect, useState} from "react";
import './index.less';
import {connect, FormattedMessage, useIntl, useLocation} from "umi";
import BRC20Icon from '@/assets/inscribe/brc20-icon.svg';
import TabsComponent2 from "@/components/TabsComponent2";
import TitleBottom from "@/assets/discover/title-bottom.svg";
import {Pagination} from "antd";
import formate from "@/utils/formattedDate";
import {shortAddress} from "@/utils/utils";
import TransfersTable from "@/components/TransfersTable";
import {history} from "@@/core/history";
import LoadingBlock from "@/components/LoadingBlock";
import NoResult from "@/components/NoResult";
import ProgressBlock from "@/components/ProgressBlock";
import {getTickInfoRequest, getTickTableData} from "@/services/http/api/api";

type DataType = {
  address: string,
  amount: number,
  progress: number,
}

type TickInfo = {
  progress: number,
  supply: number,
  minted: number,
  limitPerMint: number,
  txCount: number,
  holders: number,
  deployTime: number,
  number: number,
  id: string,
  address: string,
}

function Page() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tick = params.get('tick');

  const intl = useIntl();

  const tabs = [
    {
      key: 0, value: intl.formatMessage({
        id: 'index.tick.brc20.detail.Holders',
      }), data: '/holders'
    },
    {
      key: 1, value: intl.formatMessage({
        id: 'index.tick.brc20.detail.Transfers',
      }), data: ''
    },
  ];
  const [activeTab, setActiveTab] = useState(0);
  const switchTab = (item: any) => {
    setActiveTab(item.key);
  }

  const [tickInfo, setTickInfo] = useState<TickInfo>({
    progress: 0,
    supply: 0,
    minted: 0,
    limitPerMint: 0,
    holders: 0,
    deployTime: 0,
    number: 0,
    txCount: 0,
    id: '',
    address: ''
  })
  const totalT = intl.formatMessage({
    id: 'index.tick.brc20.detail.Total',
  })

  const tabHeader = [intl.formatMessage({
    id: 'index.tick.brc20.detail.holders.tabHeader.RANK',
  }), intl.formatMessage({
    id: 'index.tick.brc20.detail.holders.tabHeader.ADDRESS',
  }), intl.formatMessage({
    id: 'index.tick.brc20.detail.holders.tabHeader.PERCENTAGE',
  }), intl.formatMessage({
    id: 'index.tick.brc20.detail.holders.tabHeader.AMOUNT',
  })];
  const [tableData, setTableData] = useState<DataType[]>([]);

  // 分页信息
  const [current, setCurrent] = useState(1);
  const [totalSize, setTotalSize] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // 获取tick信息
  const getTickInfo = () => {
    getTickInfoRequest({tick}).then((res) => {
      const result = res.data.token;
      const supply = res.data.supply;
      const info: TickInfo = {
        progress: Number(((Number(Number(result.minted_supply).toFixed(0)) / Number(Number(result.max_supply).toFixed(0))) * 100).toFixed(2)),
        supply: Number(Number(result.max_supply).toFixed(0)),
        minted: Number(Number(result.minted_supply).toFixed(0)),
        limitPerMint: Number(Number(result.mint_limit).toFixed(0)),
        holders: supply.holders,
        deployTime: result.deploy_timestamp / 1000,
        number: result.number,
        id: result.id,
        address: result.address,
        txCount: result.tx_count
      }
      setTickInfo(info)
    }).catch((err) => {
      console.error(err);
    })
  }

  const getTabData = (page: number, pageSize: number) => {
    if (loading) return;
    setLoading(true);
    setCurrent(page);
    getTickTableData({
      tick,
      tab: tabs[activeTab].data,
      page,
      pageSize
    }).then((res) => {
      let arr: DataType[] = [];
      res.data.results.map((item: any, index: number) => {
        arr.push({
          address: item.address,
          amount: Number(Number(item.overall_balance).toFixed(0)),
          progress: Number(((Number(Number(item.overall_balance).toFixed(0)) / Number(Number(tickInfo.supply).toFixed(0))) * 100).toFixed(2))
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
    getTickInfo();
  }, [tick])

  useEffect(() => {
    if (tickInfo.supply) {
      getTabData(1, 10);
    }
  }, [tickInfo]);

  return (
    <div className={'tickPage'}>
      <div className={'brc20Top'}>
        <img src={BRC20Icon} width={88} height={88}/>
        <div className={'brc20TopContent'}>
          <div className="brc20Top-top">
            <div className={'brc20Top-text'}>BRC20</div>
            <div className={'tickHeaderRight'}>
              {
                tickInfo.progress < 100 ?
                  <div className={'mintBtn'} onClick={() => history.push(`/inscribe?tick=${tick}`)}>Mint</div>
                  :
                  <div className={'completed'}>Completed</div>
              }
            </div>
          </div>
          <div className={'tick-header-row'}>
            <div className={'tickHeaderLeft'}>
              <div className={'tick-name'}>
                <span className={'spanText'}>{tick}</span>
                <div className={'line'}/>
                <span className={'spanText'}>#{tickInfo.number}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={'tick-header'}>
        <div className={'tick-header-info'}>
          <div className={'row'}>
            <span className={'title'}><FormattedMessage id="index.tick.brc20.detail.Inscription"/>:</span>
            <span className={'value'}>{shortAddress(tickInfo.id)}</span>
          </div>
          <div className={'row'}>
            <span className={'title'}><FormattedMessage id="index.tick.brc20.detail.DeployBy"/>:</span>
            <span className={'value'}>{shortAddress(tickInfo.address)}</span>
          </div>
        </div>
      </div>

      <div className={'tick-body'}>
        <div className={'tick-body-left'}>
          <div className={'title'}>
            <FormattedMessage id="index.tick.brc20.detail.Overview"/>
            {/* <img src={TitleBottom} className={'titleBottom'}/> */}
          </div>
          <div className={'tickInfo'}>
            <div className={'tickInfo-row'}>
              <div className={'title'}><FormattedMessage id="index.tick.brc20.detail.Progress"/></div>
              <ProgressBlock value={tickInfo.progress}/>
            </div>
            <div className={'tickInfo-row'}>
              <div className={'title'}><FormattedMessage id="index.tick.brc20.detail.Supply"/></div>
              <div className={'value'}>
                {tickInfo.supply}
              </div>
            </div>
            <div className={'tickInfo-row'}>
              <div className={'title'}><FormattedMessage id="index.tick.brc20.detail.Minted"/></div>
              <div className={'value'}>
                {tickInfo.minted}
              </div>
            </div>
            <div className={'tickInfo-row'}>
              <div className={'title'}><FormattedMessage id="index.tick.brc20.detail.Limit"/></div>
              <div className={'value'}>
                {tickInfo.limitPerMint}
              </div>
            </div>
            <div className={'tickInfo-row'}>
              <div className={'title'}><FormattedMessage id="index.tick.brc20.detail.Address"/></div>
              <div className={'value'}>
                {shortAddress(tickInfo.address)}
              </div>
            </div>
            <div className={'tickInfo-row'}>
              <div className={'title'}><FormattedMessage id="index.tick.brc20.detail.Tx Count"/></div>
              <div className={'value'}>
                {tickInfo.txCount}
              </div>
            </div>
            <div className={'tickInfo-row'}>
              <div className={'title'}><FormattedMessage id="index.tick.brc20.detail.Holders"/></div>
              <div className={'value'}>
                {tickInfo.holders}
              </div>
            </div>
            <div className={'tickInfo-row'}>
              <div className={'title'}><FormattedMessage id="index.tick.brc20.detail.DeployT"/></div>
              <div className={'value'}>
                {formate(tickInfo.deployTime, 'second')}
              </div>
            </div>
          </div>
        </div>

        <div className={'tick-body-right'}>
          <div className={'tick-tab'}>
            <TabsComponent2 tabs={tabs} activeTab={activeTab} switchTab={switchTab}/>
          </div>

          {
            !activeTab ?
              <>
                <div className={'tick-body-right-table'}>
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
                                <div className={'rank'}>{(index + 1 + pageSize * (current - 1))}</div>
                                <div className={'address'}>{shortAddress(item.address)}</div>
                                <div className={'progress'}>
                                  <ProgressBlock value={item.progress}/>
                                </div>
                                <div className={'amount'}>{item.amount}</div>
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
              </>
              :
              <TransfersTable tick={tick}/>
          }
        </div>
      </div>


    </div>
  )
}

export default connect(({}: any) => ({}))(Page);
