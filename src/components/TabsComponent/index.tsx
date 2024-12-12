import React from 'react';
import './index.less'

type Props = {
  tabs: {
    key: number;
    value: string;
  }[];
  activeTab: number;
  switchTab: Function;
}

const TabsComponent = ({tabs, activeTab, switchTab}: Props) => {
  return (
    <div className={'tabs'}>
      {
        tabs.map((item: any) => (
          <div
            key={item.key}
            onClick={() => switchTab(item)}
            className={activeTab === item.key ? 'activeTabItem tabItem' : ' tabItem'}
          >
            {item.value}
          </div>
        ))
      }
    </div>
  )
}

export default TabsComponent;
