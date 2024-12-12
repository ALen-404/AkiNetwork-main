import './index.less';
import { useState } from 'react';
import { FormattedMessage } from "umi";
import akiBitLogo from "@/assets/genesisPassport/aki bit.svg";
import discord from "@/assets/media/discord.svg";
import twitter from "@/assets/media/twitter.svg";
import telegram from "@/assets/media/telegram.svg";
import medium from "@/assets/media/medium.svg";
import linkedin from "@/assets/media/linkedin.svg";
import instagram from "@/assets/media/instagram.svg";
import DropdownBlock from '../DropdownBlock';
import { MenuProps } from 'antd';

const Footer: React.FC = () => {
  const [isShow, setIsShow] = useState(false);
  const telegramItems: MenuProps['items'] = [
    {
      key: '1',
      label: <a href='https://t.me/akiprotocol' target='_black'>
        <span className='telegramTarget'>EN</span>
        <span className='telegramText'>Aki Network Official</span>
      </a>
    },
    {
      key: '2',
      label: <a href='https://t.me/akiprotocol_jap' target='_black'>
        <span className='telegramTarget'>JP</span>
        <span className='telegramText'>Aki Network Japan</span>
      </a>
    },
    {
      key: '3',
      label: <a href='https://t.me/akiprotocol_kr' target='_black'>
        <span className='telegramTarget'>KR</span>
        <span className='telegramText'>Aki Network Korea</span>
      </a>
    },
    {
      key: '4',
      label: <a href='https://t.me/akiprotocol_ru' target='_black'>
        <span className='telegramTarget'>RU</span>
        <span className='telegramText'>Aki Network Russia</span>
      </a>
    },
    {
      key: '5',
      label: <a href='https://t.me/akiprotocol_tr' target='_black'>
        <span className='telegramTarget'>TR</span>
        <span className='telegramText'>Aki Network Türkiye</span>
      </a>
    },
    {
      key: '6',
      label: <a href='https://t.me/akiprotocol_cn' target='_black'>
        <span className='telegramTarget'>CN</span>
        <span className='telegramText'>Aki Network China</span>
      </a>
    },
  ]

  return <>
    <footer className='footerBox'>
      <div className='akiLogoContext'>
        <img src={akiBitLogo}/>
        <div className='akiText'>
          <FormattedMessage id='Footer.content'/>
        </div>
      </div>
      <div className='mediaContent'>
        <div className='mediaListBox'>
          {
            [
              {logo: twitter, link: 'https://twitter.com/aki_protocol'},
              {logo: discord, link: 'https://discord.gg/akinetwork'}
            ].map(item => <a href={item.link} target='_black'>
              <img src={item.logo}/>
            </a>)
          }
          <div>
            <DropdownBlock status={isShow} trigger='hover' setStatus={setIsShow} items={telegramItems}>
              <img src={telegram} style={{cursor: 'pointer'}}/>
            </DropdownBlock>
          </div>
          {
            [
              {logo: medium, link: 'https://medium.com/@aki-network'},
              {logo: instagram, link: 'https://www.instagram.com/aki_network/'},
              {logo: linkedin, link: 'https://www.linkedin.com/company/aki-protocol/'}
            ].map(item => <a href={item.link} target='_black'>
              <img src={item.logo}/>
            </a>)
          }
        </div>
        <div className='filingInfo'>
          <FormattedMessage id='Footer.filingInfo'/>
        </div>
      </div>
    </footer>
  </>
}

export default Footer;