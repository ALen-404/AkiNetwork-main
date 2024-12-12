import React from 'react';
import {ConfigProvider, Slider} from 'antd';

type Props = {
  min: number,
  max: number,
  onChangeFun: any,
  value: string | number,
}

const SliderBlock = (props: Props) => {
  const {min, max, onChangeFun, value} = props;

  return (
    <ConfigProvider
      theme={{
        components: {
          Slider: {
            trackBg: '#FFC700 ',
            handleColor: '#FFC700 ',
            handleActiveColor: '#FFC700 ',
            trackHoverBg: '#FFC700 '
          },
        },
      }}
    >
      <Slider
        min={min}
        max={max}
        onChange={onChangeFun}
        value={typeof value === 'number' ? value : 0}
      />
    </ConfigProvider>
  )
};

export default SliderBlock;
