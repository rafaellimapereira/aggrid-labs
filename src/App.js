import React, { useEffect, useState } from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const key = 'recruiting';

const App = () => {
  const [rowData, setRowData] = useState([]);
  const [columnApi, setColumnApi] = useState(null);
  const [columns, setColumns] = useState([]);
  const [columnNames, setColumnNames] = useState({});

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
}, []);

  const loadState = (api) => {
    if (key) {
      const columnState = JSON.parse(
        localStorage.getItem(key) || JSON.stringify(columnApi?.getColumnState())
      );

      api.applyColumnState({
        state: columnState
      });
      setColumns(
        columnState.filter((column) => column.colId !== 'model')
      );
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
    setColumns(columns.map((c)=> {
      return c.colId === params.column.colId ? {...c, hide: !params.column.visible} : c;
    }))
    saveState(params);
  };

  const onFirstDataRendered = (params) => {
    params.api.addEventListener('columnResized', onColumnResized);
    params.api.addEventListener('columnPinned', onColumnPinned);
    params.api.addEventListener('columnVisible', onColumnVisible);
  };

    const onGridReady = (params) => {
      setColumnApi(params.columnApi);
      setColumns(
        params.columnApi
          .getColumnState()
          .filter((column) => column.colId !== 'model')
      );
  
      const columnNames = {};
      params.columnApi.getColumnState().forEach((column) => {
        columnNames[column.colId] = column.colId.toUpperCase();
      });
      setColumnNames(columnNames);
  
      loadState(params.columnApi);

      params.api.addEventListener('columnVisible', onColumnVisible);
    }

    const changeColumnVisibility = (ev) => {
      ev.preventDefault();
      const {target} = ev;
      const {name, checked} = target;
      console.log('changeColumnVisibility', name, checked);
      columnApi.setColumnVisible(name, checked);
    }

    const toggleColumnVisible = (colId, isHidden) => {
      columnApi.setColumnVisible(colId, isHidden);
    };

   return (
       <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
         {
           columns.map(column => {
             return  <label key={column.colId} htmlFor={column.colId}><input type="checkbox" name={column.colId} checked={!column.hide} onChange={() => toggleColumnVisible(column.colId, column.hide)} />{columnNames[column.colId]}</label>
           })
         }
           <AgGridReact
                reactUi={true}
                onGridReady={onGridReady}
                rowData={rowData}
                onFirstDataRendered={onFirstDataRendered}>
               <AgGridColumn  field="make"></AgGridColumn>
               <AgGridColumn sortable field="model"></AgGridColumn>
               <AgGridColumn filter field="price"></AgGridColumn>
           </AgGridReact>
       </div>
   );
};

export default App;