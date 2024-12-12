import React from 'react';
import './index.less';
import {Modal} from 'antd';
import {FormattedMessage} from "umi";
import WarringIcon from '@/assets/warring-icon.svg';
import DownIcon from '@/assets/down-icon.svg';


type Props = {
  isModal: boolean,
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>,
}

const OKXModal = ({isModal, setIsModal}: Props) => {

  return <Modal
    centered
    open={isModal}
    onCancel={() => setIsModal(false)}
    closeIcon={false}
    footer={false}
    maskClosable={false}
  >
    <div className={'OKXModal'}>
      <div className={'warringRow'}>
        <img src={WarringIcon} className={'warringIcon'}/>
      </div>
      <div className={'warringText'}>
        <FormattedMessage id="OKXModal.warringText"/>
      </div>
      <div className={'downRow'} onClick={() => window.open('https://www.okx.com/cn/web3')}>
        <img src={DownIcon} className={'downIcon'}/>
        <FormattedMessage id="OKXModal.downloadText"/>
      </div>
      <div className={'closeButton'} onClick={() => setIsModal(false)}>
        <FormattedMessage id="OKXModal.close"/>
      </div>
    </div>
  </Modal>
}

export default OKXModal;
