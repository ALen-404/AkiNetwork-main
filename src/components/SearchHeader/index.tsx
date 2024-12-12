import React, {useEffect, useState} from "react";
import './index.less';
import {Input, Popover} from "antd";
import {history, useIntl} from 'umi';
import SearchIcon from '@/assets/svg/header/search-icon.svg';
import BRC20Icon from '@/assets/inscribe/brc20-icon.svg';
import {getTickInfoRequest} from "@/services/http/api/api";

const SearchHeader = () => {
  const intl = useIntl();
  // 搜索信息
  const searchPlaceholder = intl.formatMessage({
    id: 'common.search.Placeholder',
  });
  const [searchValue, setSearchValue] = useState('');
  const [tickName, setTickName] = useState('');

  const searchContent = (
    <div className={'searchContent'}>
      <div className={'brc20'}>
        <img src={BRC20Icon} className={'brc20Icon'}/>BRC20 Tokens
      </div>
      <div className={'brc20Content'}>
        {
          tickName ?
            <div className={'tickName'} onClick={() => clickTickName()}>${tickName}</div>
            :
            <></>
        }
      </div>
    </div>
  );
  const onChangeSearch = (val: string) => {
    if (val.length > 4) return;
    setSearchValue(val);
  }

  const clickTickName = () => {
    history.push(`/index/tick?tick=${tickName}`);
  }

  const getTickInfo = (tick: string) => {
    getTickInfoRequest({tick}).then((res) => {
      setTickName(res.data.token.ticker);
    }).catch(err => {
      setTickName('');
    })
  }

  useEffect(() => {
    if (searchValue) {
      getTickInfo(searchValue);
    }
  }, [searchValue]);

  return (
    <div className={'SearchHeader'}>
      <Popover
        content={searchContent}
        title={`Search '${searchValue}'`}
        trigger="click"
        arrow={false}
        fresh={true}
        overlayClassName={'popoverStyle'}
        getPopupContainer={trigger => trigger.parentNode}
      >
        <div className={'header-search'}>
          <img src={SearchIcon} width={24} height={24}/>
          <Input
            placeholder={searchPlaceholder}
            bordered={false}
            value={searchValue}
            onChange={(e) => onChangeSearch(e.target.value)}
          />
        </div>
      </Popover>
    </div>
  )

}

export default SearchHeader;
