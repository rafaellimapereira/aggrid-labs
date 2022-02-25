import PropTypes from 'prop-types';
import { useState } from 'react';

export default function useGrid(key) {
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [selected, setSelected] = useState([]);

  const [columns, setColumns] = useState([]);
  const [columnNames, setColumnNames] = useState({});

  const loadState = (api) => {
    if (key) {
      const columnState = JSON.parse(
        localStorage.getItem(key) || JSON.stringify(columnApi?.getColumnState())
      );

      api.applyColumnState({
        state: columnState
      });
      setColumns(columnState.filter((column) => column.colId !== 'model'));
    }
  };

  const saveState = (params) => {
    const state = params.columnApi.getColumnState();

    if (key) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  };

  const onColumnPinned = (params) => {
    saveState(params);
  };

  const onColumnResized = (params) => {
    saveState(params);
  };

  const onColumnVisible = (params) => {
    saveState(params);
  };

  const onFirstDataRendered = (params) => {
    params.api.addEventListener('columnResized', onColumnResized);
    params.api.addEventListener('columnPinned', onColumnPinned);
    params.api.addEventListener('columnVisible', onColumnVisible);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    setColumns(params.columnApi.getColumnState().filter((column) => column.colId !== 'model'));

    const columnNames = {};
    params.columnApi.getColumnState().forEach((column) => {
      columnNames[column.colId] =
        params.columnApi.getColumn(column.colId).colDef.headerName || column.colId.toUpperCase();
    });
    setColumnNames(columnNames);

    loadState(params.columnApi);

    params.api.addEventListener('firstDataRendered', onFirstDataRendered);
  };

  const onGridClear = () => {
    gridApi.deselectAll();
  };

  const onSelected = () => {
    setSelected(gridApi.getSelectedRows().map((row) => row.id));
  };

  const toggleColumnVisible = (colId) => {
    const newColumns = columns.map((column) => ({
      ...column,
      hide: column.colId === colId ? !column.hide : column.hide
    }));

    columnApi.applyColumnState({
      state: newColumns
    });
    setColumns(newColumns);
  };

  const toggleAllColumnVisible = (isHidden) => {
    const newColumns = columns.map((column) => ({
      ...column,
      hide: isHidden
    }));

    columnApi.applyColumnState({
      state: newColumns
    });
    setColumns(newColumns);
  };

  const showLoadingOverlay = () => {
    gridApi?.showLoadingOverlay();
  };

  const hideOverlay = () => {
    gridApi?.hideOverlay();
  };

  const refreshCells = (columns, force) => {
    gridApi?.refreshCells({ columns, force });
  };

  const destroyFilter = (key) => {
    gridApi?.destroyFilter(key);
  };

  const setFilterModel = (model) => {
    gridApi?.setFilterModel(model);
  };

  const withLoading = async (action) => {
    gridApi?.showLoadingOverlay();
    try {
      return await action();
    } finally {
      gridApi?.hideOverlay();
    }
  };

  return {
    selected,
    columns,
    columnNames,
    onGridClear,
    onGridReady,
    onSelected,
    showLoadingOverlay,
    hideOverlay,
    toggleColumnVisible,
    toggleAllColumnVisible,
    refreshCells,
    destroyFilter,
    setFilterModel,
    withLoading
  };
}

useGrid.propTypes = {
  key: PropTypes.string
};
