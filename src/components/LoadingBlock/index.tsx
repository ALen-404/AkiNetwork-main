import React from 'react';
import {Spin} from 'antd';
import LoadingIcon from '@/assets/loading-icon.gif'
import './index.less';

type Props = {
  loading: boolean,
  size?: Size,
  padding?: number,
}

type Size = "small" | "default" | "large";

const LoadingBlock = (props: Props) => {
  const {loading, size = 'large', padding = 20} = props;

  return <div className={'loadingBlock'} style={{padding: `${padding}px`}}>
    <Spin
      size={size}
      spinning={loading}
      indicator={<img src={LoadingIcon} width={100} height={100}/>}
    />
  </div>
};

export default LoadingBlock;
