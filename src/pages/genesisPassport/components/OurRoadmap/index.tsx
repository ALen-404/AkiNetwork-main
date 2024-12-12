import { FormattedMessage, FormattedHTMLMessage } from "umi";
import "./index.less";

const OurRoadmap: React.FC = () => {
  return <>
    <div className="roadmapBox">
      {/* <div className="bgLight"/> */}

      <div className="title">
        <FormattedMessage id="GenesisPassport.roadmap.title" />
      </div>
      <div className="timeText">
        <FormattedMessage id="GenesisPassport.roadmap.timeText" />
      </div>
      <div className="buttonList">
        {
          [
            'common.menu.DISCOVER',
            'common.menu.INDEX',
            'common.menu.INSCRIBE',
            'common.menu.OKX_WALLET',
            'common.menu.GENESIS_PASSPORT',
          ].map(item => <>
            <div key={item} className="buttonItem">
              <FormattedMessage id={item} />
            </div>
          </>)
        }
      </div>
      <div className="QBox">
        <div className="QBoxLeft">
          <video 
            src="https://storage.googleapis.com/akiprotocol-js-cdn/video/IMF_0598.mp4" 
            autoPlay 
            muted
            playsInline
            onEnded={(event:any) => {
              event?.target?.play()
            }}
          />
        </div>

        <div className="QBoxRight">
          <div className="QTitle">
            <FormattedMessage id="GenesisPassport.roadmap.Q1.title" />
          </div>
          <div>
            <div className="pTitle">
              <FormattedMessage id="GenesisPassport.roadmap.Q1.p1.title" />
            </div>
            <ul>
              <li>
                <FormattedHTMLMessage id='GenesisPassport.roadmap.Q1.p1.li.1' />
              </li>
              <li>
                <FormattedHTMLMessage id='GenesisPassport.roadmap.Q1.p1.li.2' />
              </li>
              <li>
                <FormattedHTMLMessage id='GenesisPassport.roadmap.Q1.p1.li.3' />
              </li>
              <li>
                <FormattedHTMLMessage id='GenesisPassport.roadmap.Q1.p1.li.4' />
              </li>
            </ul>
          </div>
          <div className="pTitle">
            <FormattedMessage id="GenesisPassport.roadmap.Q1.p2.title" />
          </div>
          <div className="pSubTitle">
            <FormattedHTMLMessage className="p2Title" id='GenesisPassport.roadmap.Q1.p2.li.1'/>
          </div>
          <div className="pSubTitle">
            <FormattedHTMLMessage className="p2Title" id='GenesisPassport.roadmap.Q1.p4.title' />
          </div>
          <div className="pSubTitle">
            <FormattedHTMLMessage className="p2Title" id='GenesisPassport.roadmap.Q1.p5.title' />
          </div>
        </div>
      </div>
      <div className="QBox rowReverse">
        <div className="QBoxLeft">
        <video 
          src="https://storage.googleapis.com/akiprotocol-js-cdn/video/IMF_0599.mp4" 
          autoPlay 
          muted
          playsInline
          onEnded={(event:any) => {
            event?.target?.play()
          }}
        />
        </div>
        <div className="QBoxRight">
          <div className="QTitle">
            <FormattedMessage id="GenesisPassport.roadmap.Q2.title" />
          </div>
          <div>
            <div className="pTitle">
              <FormattedMessage id="GenesisPassport.roadmap.Q2.p1.title" />
            </div>
            <ul>
              <li>
                <FormattedMessage id='GenesisPassport.roadmap.Q2.p1.li.1'/>
              </li>
              <li>
                <FormattedMessage id='GenesisPassport.roadmap.Q2.p1.li.2'/>
              </li>
            </ul>
          </div>
          <div>
            <a className="pTitle" href="https://akiprotocol.io/airdrop/browse" target="_black">
              <FormattedMessage id="GenesisPassport.roadmap.Q2.p2.title" />
            </a>
          </div>
          <div className="pSubTitle">
            <FormattedMessage id="GenesisPassport.roadmap.Q2.p2.li.1" />
          </div>
          {/* <div className="pTitle">
            <FormattedMessage id="GenesisPassport.roadmap.Q2.p3.title" />
          </div> */}
          <div className="pSubTitle weight900">
            <FormattedHTMLMessage id="GenesisPassport.roadmap.Q2.p4.title"/>
          </div>
          <div className="subButtonList">
            {
              [
                'GenesisPassport.roadmap.Q2.p5.BRC-420',
                'GenesisPassport.roadmap.Q2.p5.ARC-20',
                'GenesisPassport.roadmap.Q2.p5.RUNES',
                'GenesisPassport.roadmap.Q2.p5.MRC-20',
              ].map(item => <>
                <div key={item}>
                  <FormattedMessage id={item} />
                </div>
              </>)
            }
            {/* <span>...</span> */}
          </div>
        </div>
      </div>
    </div>
  </>
}

export default OurRoadmap;