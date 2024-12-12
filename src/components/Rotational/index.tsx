import React from 'react';
import {Carousel} from 'antd';
import './index.less';
import Rotational1 from '@/assets/discover/rotational/rotational-1.jpg';


const Rotational: React.FC = () => (
  <Carousel autoplay className={'carousel'}>
    <img src={Rotational1} className={'imgStyle'}/>
    <img src={Rotational1} className={'imgStyle'}/>
    <img src={Rotational1} className={'imgStyle'}/>
    <img src={Rotational1} className={'imgStyle'}/>
  </Carousel>
);

export default Rotational;
