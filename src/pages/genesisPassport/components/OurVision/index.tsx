import { FormattedMessage, FormattedHTMLMessage } from "umi";
import "./index.less";
import { useState } from "react";

const OurVision: React.FC = () => {

  const [showSloganAnimation, setShowSloganAnimation] = useState(false)

  return <>
    <div className="visionBox">
      <div>
        <div className="title">
          <FormattedMessage id="GenesisPassport.vision.title" />
        </div>
        <div className="subTitle">
          <FormattedHTMLMessage id="GenesisPassport.vision.subTitle" />
        </div>
        <div className={`slogan ${showSloganAnimation ? "fadeInBottom" : ""}`}>
          <FormattedMessage id="GenesisPassport.vision.slogan" />
        </div>
      </div>
      <video 
        src="https://storage.googleapis.com/akiprotocol-js-cdn/video/IMF_0560.mp4" 
        autoPlay 
        muted
        playsInline
        onEnded={(event:any) => {
          event?.target?.play()
        }}
      />
      <div className="tips">
        <FormattedMessage id="GenesisPassport.vision.tips.1" />
        <FormattedMessage id="GenesisPassport.vision.tips.2" />
      </div>
    </div>
  </>
}

export default OurVision;