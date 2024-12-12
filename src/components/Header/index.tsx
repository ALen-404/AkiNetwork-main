import React, {useEffect, useState} from "react";
import './index.less';
import {Drawer, type MenuProps} from 'antd';
import {connect, FormattedMessage, history, getLocale} from 'umi';
import {shortAddress} from "@/utils/utils";
import SearchHeader from "@/components/SearchHeader";
import DropdownBlock from "@/components/DropdownBlock";
import OKXModal from "@/components/OKXModal";
import HeaderTitle from '@/assets/genesisPassport/aki bit.svg';
import RefuelingIcon from '@/assets/svg/header/refueling-icon.svg';
// import WalletIcon from '@/assets/svg/header/wallet-icon.svg';
import AvatarIcon from '@/assets/avatar-icon.svg';
import ArrowsIcon from '@/assets/arrows-icon.svg';
import SlowIcon from '@/assets/inscribe/feeIcon/slow-icon.svg';
import FastIcon from '@/assets/inscribe/feeIcon/fast-icon.svg';
import HyperIcon from '@/assets/inscribe/feeIcon/hyper-icon.svg';
import LanguageIcon from '@/assets/language-icon.svg';
import OptionIcon from '@/assets/option-icon.svg';
import CloseMenuIcon from '@/assets/closeMenu-icon.svg';
import {getGasFeeInfo} from "@/services/http/api/api";

type TabInfo = {
  key: number
  title: string
  path: string
};

function Header(
  {
    tabNav,
    activeTab,
    switchTab,
    setMenuShow,
    menuShow,
    languageShow,
    setLanguageShow,
    languageItems,
    address,
    loginStatus,
    dispatch
  }: any) {

  // 滚动条位置
  const [scrollPosition, setScrollPosition] = useState(0);
  const locale = getLocale();

  // 账户信息
  const [isShow, setIsShow] = useState(false);
  const walletItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={() => history.push('/inscribeOrders')} className={'nav_wallet_menu_list'}>
          <FormattedMessage id="common.menu.wallet.InscribeOrders"/>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={() => dispatch({type: 'aki/clearSignMessage'})} className={'nav_wallet_menu_list'}>
          <FormattedMessage id="common.menu.wallet.Disconnect"/>
        </div>
      ),
    },
  ];

  // 下载Okx钱包弹窗
  const [isModal, setIsModal] = useState(false);

  // 连接钱包
  const connectWallet = async () => {
    if ((window as any).okxwallet) {
      if ((window as any).okxwallet.bitcoin.selectedAccount) {
        await dispatch({type: 'aki/getSignMessage'});
      } else {
        await dispatch({type: 'aki/getWallet'});
        await dispatch({type: 'aki/getSignMessage'});
      }
    } else {
      setIsModal(true);
    }
  }

  // 费用信息
  const [feeShow, setFeeShow] = useState(false);
  const [slowFee, setSlowFee] = useState(0);
  const [fastFee, setFastFee] = useState(0);
  const [hyperFee, setHyperFee] = useState(0);
  const feeItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div style={{color: '#4F5153', fontFamily: 'Inter', fontSize: '14px'}}>
          Low:
          <span style={{color: '#201E1B', fontSize: '16px'}}> {slowFee} sats/vB</span>
        </div>
      ),
      icon: <img src={SlowIcon} width={24}/>
    },
    {
      key: '2',
      label: (
        <div style={{color: '#4F5153', fontFamily: 'Inter', fontSize: '14px'}}>
          Medium:
          <span style={{color: '#201E1B', fontSize: '16px'}}> {fastFee} sats/vB</span>
        </div>
      ),
      icon: <img src={FastIcon} width={24}/>
    },
    {
      key: '3',
      label: (
        <div style={{color: '#4F5153', fontFamily: 'Inter', fontSize: '14px'}}>
          High:
          <span style={{color: '#201E1B', fontSize: '16px'}}> {hyperFee} sats/vB</span>
        </div>
      ),
      icon: <img src={HyperIcon} width={24}/>
    },
  ];

  // 获取费用信息
  const getFeeInfo = () => {
    getGasFeeInfo().then((res) => {
      setSlowFee(res.data.hourFee);
      setFastFee(res.data.halfHourFee);
      setHyperFee(res.data.fastestFee);
    }).catch((err) => {
      console.error(err);
      clearInterval(interval);
    })
  }

  // 定时器
  let interval: any = null;
  useEffect(() => {
    getFeeInfo();
    interval = setInterval(() => {
      getFeeInfo();
    }, 5000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', function () {
      // 检测滚动条的垂直滚动位置
      setScrollPosition(window.scrollY);
    });

    return window.removeEventListener('scroll', function () {
    })
  }, []);

  return (
    <div className={'header'}
        //  style={scrollPosition > 10 ? {backgroundColor: 'white'} : {backgroundColor: 'rgba(0,0,0,0)'}}
    >
      <header className="headerTop">
        <div className={'header-aside'}>
          <div className="header-aside-img-box" onClick={() => {
            setMenuShow(false);
            history.push('/')
          }}>
            <img src={HeaderTitle} className={'header-aside-img'}/>
          </div>

          <div className={'header-nav'}>
            {
              tabNav.map((item: TabInfo) => (
                <div
                  key={item.key}
                  className={activeTab === item.path ? 'activeTitle title' : 'title'}
                  onClick={() => switchTab(item)}
                >
                  {item.title}
                </div>
              ))
            }
          </div>
        </div>


        <div className={'header-right-bar'}>

          <div className={'search-block'}>
            <SearchHeader/>
          </div>

          <DropdownBlock status={feeShow} setStatus={setFeeShow} items={feeItems}>
            <div className={'refueling'}>
              <img src={RefuelingIcon} className={'refueling-img'}/>
              <div className={'refueling-text'}>{fastFee}</div>
            </div>
          </DropdownBlock>

          <DropdownBlock status={languageShow} setStatus={setLanguageShow} items={languageItems}>
            <div className={'language'}>
              <img src={LanguageIcon} className={'languageIcon'}/>
            </div>
          </DropdownBlock>

          {
            loginStatus ?
              <DropdownBlock status={isShow} setStatus={setIsShow} items={walletItems}>
                <div className={'wallet'}>
                  <img src={AvatarIcon} width={24} height={24}/>
                  <div className={'text'}>{shortAddress(address)}</div>
                  <img src={ArrowsIcon} width={15} height={8} className={isShow ? 'arrowUp' : 'arrowDown'}/>
                </div>
              </DropdownBlock>
              :
              <div className={'unWallet'} onClick={connectWallet}>
                {/* <img src={WalletIcon} className={'img'}/> */}
                <div className={'text'}><FormattedMessage id="common.menu.wallet.Connect"/></div>
              </div>
          }

          <div className={'optionBtn'} onClick={() => setMenuShow(!menuShow)}>
            <img src={OptionIcon} className={'optionIcon'}/>
            {/* {
              menuShow ?
                <img src={CloseMenuIcon} className={'closeIcon'}/>
                :
                <img src={OptionIcon} className={'optionIcon'}/>
            } */}
          </div>
        </div>
      </header>

      {/* <div className={'headerBottom'}>
        <div className={'feeInfo'}>
          <div className={'feeText'}> Low: {slowFee} sats/vB</div>
          <div className={'feeText'}> Medium: {fastFee} sats/vB</div>
          <div className={'feeText'}> High: {hyperFee} sats/vB</div>
        </div>
        <div className={'search-block'}>
          <SearchHeader/>
        </div>
      </div> */}

      <Drawer 
        rootClassName='menuDrawerBox' 
        placement='right'
        onClose={() => setMenuShow(!menuShow)} 
        style={{
          width: '240px'
        }}
        open={menuShow}
      >
        <div>
          <DropdownBlock status={languageShow} setStatus={setLanguageShow} items={languageItems}>
            <div className={'languageBlock'}>
              <div className={'languageLeft'}>
                {locale === 'ja' ? '日本語' : (locale === 'en-US' ? 'English' : 'Language')}
              </div>
              <div className={'languageRight'}>
                <img src={ArrowsIcon} width={14} height={8} className={languageShow ? 'arrowUp' : 'arrowDown'}/>
              </div>
            </div>
          </DropdownBlock>
          <div className="tabNavList">
            {
              tabNav.map((item: TabInfo) => (
                <div
                  key={item.key}
                  className={activeTab === item.path ? 'activeTitle title' : 'title'}
                  onClick={() => switchTab(item)}
                >
                  {item.title}
                </div>
              ))
            }
          </div>
        </div>
        <div className="feeItemsList">
          {
            feeItems.map((item: any) => (
              <div key={item?.keys} className="feeItemDiv">
                {item.icon}{item.label}
              </div>
            ))
          }
        </div>
      </Drawer>

      <OKXModal isModal={isModal} setIsModal={setIsModal}/>

    </div>
  );
}

export default connect(({aki}: any) => ({
  address: aki.address,
  loginStatus: aki.loginStatus
}))(Header);
