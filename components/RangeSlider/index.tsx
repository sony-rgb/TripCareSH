import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import Slider from 'rn-range-slider';
import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
import Notch from './Notch';
import Label from './Label';

import styles from './styles';

export default function RangeSlider({
  style = {},
  color = '#7f7f7f',
  selectionColor = '#4499ff',
  min = 0,
  max = 100,
  onValueChanged = (low, hight) => {},
}) {
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(
    () => <Rail color={color} />,
    [color],
  );
  const renderRailSelected = useCallback(
    () => <RailSelected color={selectionColor} />,
    [selectionColor],
  );
  const renderLabel = useCallback(
    value => <Label text={value} color={selectionColor} />,
    [selectionColor],
  );
  const renderNotch = useCallback(
    () => <Notch color={selectionColor} />,
    [selectionColor],
  );

  return (
    <Slider
      style={[styles.slider, style]}
      min={min}
      max={max}
      step={1}
      disableRange={false}
      floatingLabel={true}
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      renderLabel={renderLabel}
      renderNotch={renderNotch}
      onValueChanged={onValueChanged}
    />
  );
}

RangeSlider.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  color: PropTypes.string,
  selectionColor: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  onValueChanged: PropTypes.func,
};
