/* eslint-disable no-restricted-globals */
/* eslint-disable react/display-name */
import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

class OrdersTable extends Component {
  state = {
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Email', field: 'email' },
      { title: 'Phone', field: 'phone' },
      { title: 'Time', field: 'time' },
      { title: 'Guests', field: 'numOfPeople' },
    ],
    data: [],
  };

  componentDidMount() {
    const { data } = this.props;
    this.setState({ data });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return { data: nextProps.data };
    }
    return null;
  }

  render() {
    const { columns, data } = this.state;
    const { onDelete, onEdit } = this.props;

    return (
      <MaterialTable
        title="Report"
        icons={tableIcons}
        columns={columns}
        size="medium"
        data={data}
        actions={[
          {
            icon: () => <Edit color="primary" fontSize="small" />,
            tooltip: 'Edit Record',
            onClick: (event, rowData) => onEdit(rowData._id),
          },
          {
            icon: () => <DeleteOutline color="primary" />,
            tooltip: 'Delete Record',
            onClick: (event, rowData) => {
              confirm(`You want to delete ${rowData.name}`);
              onDelete(rowData._id);
            },
          },
        ]}
        options={{
          exportButton: true,
          actionsColumnIndex: -1,
        }}
      />
    );
  }
}
OrdersTable.propTypes = {
  data: PropTypes.array,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default OrdersTable;
