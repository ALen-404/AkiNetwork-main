import React from 'react';
import './index.less';
import NoResultIcon from '@/assets/no-result.svg';

type Props = {
  text?: string
}

const NoResult = (props: Props) => {
  const {text = 'No Result'} = props;

  return <div className={'noResult'}>
    <img src={NoResultIcon} className={'noResultIcon'}/>
    <div className={'noDataText'}>{text}</div>
  </div>
}

export default NoResult;
