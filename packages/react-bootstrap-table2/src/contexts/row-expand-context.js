/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';

export default (
  dataOperator
) => {
  const RowExpandContext = React.createContext();

  class RowExpandProvider extends React.Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      data: PropTypes.array.isRequired,
      keyField: PropTypes.string.isRequired
    }

    state = { expanded: this.props.expandRow.expanded || [] };

    componentWillReceiveProps(nextProps) {
      if (nextProps.expandRow) {
        this.setState(() => ({
          expanded: nextProps.expandRow.expanded || this.state.expanded
        }));
      }
    }

    handleRowExpand = (rowKey, expanded, rowIndex, e) => {
      const { data, keyField, expandRow: { onExpand } } = this.props;

      let currExpanded = [...this.state.expanded];

      if (expanded) {
        currExpanded.push(rowKey);
      } else {
        currExpanded = currExpanded.filter(value => value !== rowKey);
      }

      if (onExpand) {
        const row = dataOperator.getRowByRowId(data, keyField, rowKey);
        onExpand(row, expanded, rowIndex, e);
      }
      this.setState(() => ({ expanded: currExpanded }));
    }

    handleAllRowExpand = (e, expandAll) => {
      const {
        data,
        keyField,
        expandRow: {
          onExpandAll,
          nonExpandable
        }
      } = this.props;
      const { expanded } = this.state;

      let currExpanded;

      if (expandAll) {
        currExpanded = expanded.concat(dataOperator.expandableKeys(data, keyField, nonExpandable));
      } else {
        currExpanded = expanded.filter(s => typeof data.find(d => d[keyField] === s) === 'undefined');
      }

      if (onExpandAll) {
        onExpandAll(expandAll, dataOperator.getExpandedRows(data, keyField, currExpanded), e);
      }

      this.setState(() => ({ expanded: currExpanded }));
    }

    render() {
      const { data, keyField } = this.props;
      return (
        <RowExpandContext.Provider
          value={ {
            isAnyExpands: dataOperator.isAnyExpands(data, keyField, this.state.expanded),
            expanded: this.state.expanded,
            onRowExpand: this.handleRowExpand,
            onAllRowExpand: this.handleAllRowExpand
          } }
        >
          { this.props.children }
        </RowExpandContext.Provider>
      );
    }
  }
  return {
    Provider: RowExpandProvider,
    Consumer: RowExpandContext.Consumer
  };
};
