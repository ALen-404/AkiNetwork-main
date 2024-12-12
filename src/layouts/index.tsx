import React, { useEffect, useState } from 'react';
import { connect, getLocale, history, Outlet, setLocale, useIntl, useLocation } from "umi";
import Header from '@/components/Header';
import type { MenuProps } from 'antd';
import './index.less';
import DropdownBlock from "@/components/DropdownBlock";
import LanguageIcon from '@/assets/language-icon.svg';
import ArrowsIcon from '@/assets/arrows-icon.svg';
import Footer from '@/components/Footer';

type TabInfo = {
  key: number
  title: string
  path: string
};

function Layout({ address, dispatch }: any) {
  const location = useLocation();
  const intl = useIntl();

  // 菜单切换
  const tabNav: TabInfo[] = [
    {
      key: 5, title: intl.formatMessage({
        id: 'common.menu.GENESIS_PASSPORT',
      }), path: '/genesisPassport'
    },
    {
      key: 0, title: intl.formatMessage({
        id: 'common.menu.DISCOVER',
      }), path: '/discover'
    },
    // {key: 1, title: 'PROFILE', path: '/profile'},
    // {key: 2, title: 'INSCRIPTIONS', path: '/inscriptions'},
    {
      key: 3, title: intl.formatMessage({
        id: 'common.menu.INDEX',
      }), path: '/index'
    },
    {
      key: 4, title: intl.formatMessage({
        id: 'common.menu.INSCRIBE',
      }), path: '/inscribe'
    }
  ];
  const [activeTab, setActiveTab] = useState(location.pathname);

  // 切换tab
  const switchTab = (info: TabInfo) => {
    setMenuShow(false);
    setActiveTab(info.path);
    history.push(info.path);
  }

  // 菜单显示
  const [menuShow, setMenuShow] = useState(false);

  // 国际化信息
  const locale = getLocale();
  const [languageShow, setLanguageShow] = useState(false);
  const languageItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={() => {
          setLocale('ja', false);
          setMenuShow(false);
        }} style={
          locale === 'ja' ? {
            color: '#000', fontSize: '16px', fontWeight: 700, fontFamily: 'Inter', textAlign: 'center', padding: '6px 18px', borderRadius: '8px', background: 'linear-gradient(180deg, #FFDB5C 0%, #FFC700 100%)'
          } : {
            color: '#000', fontSize: '16px', fontWeight: 700, fontFamily: 'Inter', textAlign: 'center'
          }}>日本語</div>
      )
    },
    {
      key: '2',
      label: (
        <div onClick={() => {
          setLocale('en-US', false);
          setMenuShow(false);
        }}
          style={
            locale === 'en-US' ?
              {
                color: '#000', fontSize: '16px', fontWeight: 700, fontFamily: 'Inter', textAlign: 'center', padding: '6px 18px', borderRadius: '8px', background: 'linear-gradient(180deg, #FFDB5C 0%, #FFC700 100%)'
              } : {
                color: '#000', fontSize: '16px', fontWeight: 700, fontFamily: 'Inter', textAlign: 'center'
              }}>English</div>
      )
    },
  ];

  // 初始化链接钱包
  useEffect(() => {
    if ((window as any).okxwallet) {
      if ((window as any).okxwallet.bitcoin.selectedAccount) {
        // 初始化链接钱包
        dispatch({ type: 'aki/getWallet' });
      } else {
        localStorage.setItem('isLoginStatus', 'false');
      }

      // 监听钱包变化
      (window as any).okxwallet.bitcoin.on('accountChanged', (addressInfo: any) => {
        dispatch({ type: 'aki/getWallet' });
      });
    }
  }, []);

  useEffect(() => {
    if (address) {
      const loginStatus = localStorage.getItem('isLoginStatus') === 'true';
      dispatch({ type: 'aki/changeLoginStatus', payload: { loginStatus: loginStatus } });
    }
  }, [address]);

  // 路由切换
  useEffect(() => {
    const firstLevelRoute = '/' + location.pathname.split("/")[1];
    tabNav.map((item: TabInfo) => {
      if (firstLevelRoute === item.path) return setActiveTab(item.path);
    })
    if (location.pathname === '/') {
      setActiveTab('/genesisPassport');
    }
  }, [location.pathname]);

  return (
    <div className={'layout'}>
      <Header
        tabNav={tabNav}
        activeTab={activeTab}
        switchTab={switchTab}
        setMenuShow={setMenuShow}
        menuShow={menuShow}
        languageShow={languageShow}
        setLanguageShow={setLanguageShow}
        languageItems={languageItems}
      />
      {/* {
        menuShow ?
          <div className={'menuList'}>
            <div className={'listBlock'}>
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
              <div className={'languageBlock'}>
                <div className={'languageLeft'}>
                  <img src={LanguageIcon} className={'languageIcon'}/>
                  LANGUAGE
                </div>
                <DropdownBlock status={languageShow} setStatus={setLanguageShow} items={languageItems}>
                  <div className={'languageRight'}>
                    <img src={ArrowsIcon} width={14} height={8} className={languageShow ? 'arrowUp' : 'arrowDown'}/>
                  </div>
                </DropdownBlock>
              </div>
            </div>
          </div>
          :
          <div className={'outLet'}>
            <Outlet/>
          </div>
      } */}
      <div className={'outLet'}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default connect(({ aki }: any) => ({
  address: aki.address,
}))(Layout);
