import { useState, useMemo, useEffect, useRef } from "react";
import { FormattedMessage, FormattedHTMLMessage } from "umi";
import akiUtilitiesLogo1 from "@/assets/genesisPassport/aki_utilities_logo1.svg";
import akiUtilitiesLogo2 from "@/assets/genesisPassport/aki_utilities_logo2.svg";
import akiUtilitiesLogo3 from "@/assets/genesisPassport/aki_utilities_logo3.svg";
import "./index.less";


const useIsInViewport: React.FC = (ref:any) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      ),
    [],
  );

  useEffect(() => {
    observer.observe(ref?.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}

interface AkiBITCardInterface {
  cardId: number,
  logoUrl: string
}

const AkiBITCard: React.FC<AkiBITCardInterface>= ({
  cardId,
  logoUrl
}) => {
  const ref = useRef(null);
  const [isShow, setIsShow] = useState(false)

  const isInViewport = useIsInViewport(ref)
  useEffect(() => {
    if (isInViewport && !isShow) {
      setIsShow(true)
    }
  }, [isInViewport])
  
  return <>
    <div ref={ref} className={`akiBitBoxCell ${isShow ? 'fadeInButton' : ''}`}>
      <img src={logoUrl} className="logo" />
      <div className="cardTitle">
        <FormattedMessage id={`GenesisPassport.AkiBit.card.${cardId}.title`} />
      </div>
      <div className="content">
        <FormattedHTMLMessage  id={`GenesisPassport.AkiBit.card.${cardId}.content`}/>
      </div>
    </div>
  </>
}


const AKIUtilitiesInAkiBIT: React.FC = () => {
  return <>
    <div className="akiBitBox">
      <div className="title">
        <FormattedMessage id="GenesisPassport.AkiBit.title" />
      </div>
      <div className="akiBitBoxRow">
        {
          [
            { logoUrl: akiUtilitiesLogo1, cardId: 1},
            { logoUrl: akiUtilitiesLogo2, cardId: 2},
            { logoUrl: akiUtilitiesLogo3, cardId: 3},
          ].map((item) => <AkiBITCard key={item.cardId} cardId={item.cardId} logoUrl={item.logoUrl}/>)
        }
      </div>
    </div>
  </>
}

export default AKIUtilitiesInAkiBIT;