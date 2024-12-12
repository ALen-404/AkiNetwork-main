import { FormattedMessage, useIntl, FormattedHTMLMessage } from "umi";
// import { useState } from "react";
// import { Input, notification } from "antd";
// import { emailSubscribe } from "@/services/http/api/mintApi";
import akiBitLogo from "@/assets/genesisPassport/aki bit.svg";
import "./index.less";
import MintAkiBitNFT from "../MintAkiBitNFT";

const MarketingPublicity: React.FC = () => {
  // const intl = useIntl();
  // const emailPlaceholder = intl.formatMessage({
  //   id: 'GenesisPassport.index.enterEmailPlaceholder',
  // });
  // const [email, setEmail] = useState('');
  // const [loading, setLoading] = useState(false);

  // const [api, contextHolder] = notification.useNotification();

  // // 邮箱订阅
  // const emailSubscribeFun = () => {
  //   if (loading || !email) return;
  //   setLoading(true);
  //   const request = {
  //     address: email
  //   }
  //   emailSubscribe({request}).then((res: any) => {
  //     if (res?.data?.code === 200) {
  //       api.success({message: res?.data?.msg, placement: 'topRight'})
  //       setEmail('')
  //     }
  //   }).catch((err) => {
  //     console.error(err);
  //   }).finally(() => {
  //     setLoading(false);
  //   })
  // }

  return <div>
    {/* {contextHolder} */}
    <div className="indexBox">
      <div className="indexBoxLeft">
        <div className="titleBox">
          {/* <div className="bgOval"/> */}
          <div>
            <img src={akiBitLogo} className="logo"/>
            <div className="subTitle">
              <FormattedMessage id="common.menu.GENESIS_PASSPORT"/>
            </div>
          </div>
        </div>
        <div className="subTitleBox">
          <div className="content">
            <div>
              <FormattedMessage id="GenesisPassport.index.subtitle.li1.0"/><br/>
              <FormattedMessage id="GenesisPassport.index.subtitle.li1.1"/><br/>
              <FormattedMessage id="GenesisPassport.index.subtitle.li1.2"/><br/>
              <FormattedMessage id="GenesisPassport.index.subtitle.li1.0"/>
            </div>
          </div>
          <div className="subTitleText">
            <FormattedMessage id="GenesisPassport.index.subtitle.li2"/>
          </div>
        </div>
        {/* <div className="describeBox">
          <FormattedMessage id="GenesisPassport.index.describe.li1"/><br/>
          <FormattedHTMLMessage id="GenesisPassport.index.describe.li2"/>
        </div> */}
        {/* <div className="emailBox">
          <Input
            value={email}
            placeholder={emailPlaceholder}
            disabled={loading}
            onChange={(e) => setEmail(e?.target?.value)}
          />
          <button onClick={emailSubscribeFun} disabled={loading}>
            <FormattedMessage id="GenesisPassport.index.registerWithEmail" />
          </button>
        </div> */}
      </div>

      <div className="indexBoxRight">
        <video
          src="https://storage.googleapis.com/akiprotocol-js-cdn/video/IMG_0597.MP4" 
          autoPlay 
          muted
          playsInline
          onEnded={(event:any) => {
            event?.target?.play()
          }}
          className="img"
        />
      </div>

      <div className="indexBoxBg"/>
    </div>
    
    {/* <MintAkiBitNFT/> */}
  </div>
}

export default MarketingPublicity;