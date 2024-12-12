import { connect } from "umi";
import "./index.less";
import MarketingPublicity from "./components/MarketingPublicity";
import OurRoadmap from "./components/OurRoadmap";
import OurVision from "./components/OurVision";
import AKIUtilitiesInAkiBIT from "./components/AKIUtilitiesInAkiBIT";
import EcosystemPartners from "./components/EcosystemPartners";

function Page() {
  return (
    <div className="genesisPassportContent">

      <div className="genesisPassport">

        <MarketingPublicity/>

        <OurRoadmap/>

        <OurVision/>

        <AKIUtilitiesInAkiBIT/>

        <EcosystemPartners/>
      </div>
    </div>
  );
}

export default connect(({}: any) => ({}))(Page);
