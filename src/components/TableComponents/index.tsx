import React from 'react';

import './index.less';

type Props = {
  tabHeader: string[];
  children: React.ReactNode
}

const TableComponents = ({tabHeader, children}: Props) => {
  return (
    <div className={'TableComponents'}>
      <div className={'tableContent'}>
        <div className={'tableHeader'}>
          {
            tabHeader.map((item: string, index: number) => (
              <div key={index} className={'headerText'}>{item}</div>
            ))
          }
        </div>
        <div className={'tableBody'}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default TableComponents;
