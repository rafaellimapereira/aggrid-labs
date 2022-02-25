import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React, { useEffect, useRef, useState } from 'react';

import useGrid from './useGrid';

const App = () => {
  const [rowData, setRowData] = useState([]);
  const grid = useGrid('recruiting');
  const gridRef = useRef(null);
  const getRowNodeId = (data) => data.id;

  const defaultColDef = {
    sorteable: true,
    filter: true,
    resizable: true,
    suppressSizeToFit: false,
    minWidth: 20
  };

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      {grid.columns.map((column) => {
        return (
          <label key={column.colId} htmlFor={column.colId}>
            <input
              type="checkbox"
              name={column.colId}
              checked={!column.hide}
              onChange={() => grid.toggleColumnVisible(column.colId, column.hide)}
            />
            {grid.columnNames[column.colId]}
          </label>
        );
      })}
      <AgGridReact
        tooltipShowDelay={0}
        defaultColDef={defaultColDef}
        enableCellChangeFlash
        immutableData
        ref={gridRef}
        rowSelection="multiple"
        getRowNodeId={getRowNodeId}
        rowMultiSelectWithClick
        suppressColumnVirtualisation
        reactUi={true}
        onGridReady={grid.onGridReady}
        rowData={rowData}
        onFirstDataRendered={grid.onFirstDataRendered}>
        <AgGridColumn sortable field="make"></AgGridColumn>
        <AgGridColumn
          pinned
          field="model"
          headerComponentParams={{
            hasPinIcon: false,
            hasVisibilityIcon: false
          }}></AgGridColumn>
        <AgGridColumn filter field="price"></AgGridColumn>
      </AgGridReact>
    </div>
  );
};

export default App;
