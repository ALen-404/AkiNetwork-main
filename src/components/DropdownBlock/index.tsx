import React from 'react';
import './index.less';
import {Dropdown, DropdownProps, MenuProps} from "antd";

type Props = {
  status: boolean;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
  items: MenuProps['items'];
  trigger: 'click'|'hover'|'contextMenu';
  children: React.ReactNode;
}

const DropdownBlock = ({status, setStatus, items, trigger = 'click', children}: Props) => {
  const handleOpenChange: DropdownProps['onOpenChange'] = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setStatus(nextOpen);
    }
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setStatus(false);
  };

  return <Dropdown
    menu={{items, onClick: handleMenuClick}}
    placement="bottom"
    trigger={[trigger]}
    open={status}
    onOpenChange={handleOpenChange}
  >
    {children}
  </Dropdown>
}

export default DropdownBlock;
