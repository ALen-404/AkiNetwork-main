import React from 'react';
import {Progress} from 'antd';
import './index.less'

type Props = {
  value: number
}

const ProgressBlock = ({value}: Props) => {
  return <Progress className='progressBlock' percent={value} status="active" strokeColor={{
    from: '#FFDB5C',
    to: '#FFC700'
  }}/>
}

export default ProgressBlock;
