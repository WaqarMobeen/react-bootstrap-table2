import React from 'react';
import Const from '../const';
import SelectionContext from '../contexts/selection-context';

/* eslint react/prop-types: 0 */
export default (props) => {
  const resolveProps = (selectionProps) => {
    if (selectionProps) {
      return {
        selected: [],
        ...props.selectRow,
        ...selectionProps
      };
    }

    return {
      mode: Const.ROW_SELECT_DISABLED,
      selected: []
    };
  };

  return (
    <SelectionContext.Consumer>
      { selectionProps => props.children(resolveProps(selectionProps)) }
    </SelectionContext.Consumer>
  );
};
