import { FormattedMessage, FormattedHTMLMessage } from "umi";
import XLINK_logo from "@/assets/genesisPassport/partner/XLINK_logo.png";
import Zeepr_logo from "@/assets/genesisPassport/partner/Zeepr_logo.png";
import Merlin_Protocol_logo from "@/assets/genesisPassport/partner/Merlin_Protocol_logo.png";
import Arena_Of_Faith_logo from "@/assets/genesisPassport/partner/Arena_Of_Faith_logo.png";
import SOLMASH_logo from "@/assets/genesisPassport/partner/SOLMASH_logo.png";
import SoBit_logo from "@/assets/genesisPassport/partner/SoBit_logo.png";
import Particle_Network_logo from "@/assets/genesisPassport/partner/Particle_Network_logo.png";
import BRC_20_logo from "@/assets/genesisPassport/partner/BRC_20_logo.svg";
import "./index.less";

const EcosystemPartners: React.FC = () => {
  const partners = [
    {logo: XLINK_logo, link: 'https://www.xlink.network/'}, 
    {logo: Zeepr_logo, link: 'https://www.zeepr.io/'}, 
    {logo: Merlin_Protocol_logo, link: 'https://merlinprotocol.org/'}, 
    {logo: Arena_Of_Faith_logo, link: 'https://aof.games/'},
    {logo: SOLMASH_logo, link: 'https://solmash.wtf/'},
    {logo: SoBit_logo, link: 'https://t.co/YPh6vg86hP'},
    {logo: Particle_Network_logo, link: 'https://particle.network/'},
    {logo: BRC_20_logo, link: 'https://brc20.com/'}
  ]

  return <>
    <div className="partnersBox">
      <div className="title">
        <FormattedMessage id="GenesisPassport.Partners.title" />
      </div>
      <div className="scrollBox">
        <div className="partnersBoxRow">
          {
            partners.map(item => 
              <>
                <a key={item.link} href={item.link} target="_black">
                  <img src={item.logo}/>
                </a>
              </>
            )
          }
          {
            partners.map(item => 
              <>
                <a className="partnersCopy" key={item.link} href={item.link} target="_black">
                  <img src={item.logo}/>
                </a>
              </>
            )
          }
        </div>
      </div>
    </div>
  </>
}

export default EcosystemPartners;