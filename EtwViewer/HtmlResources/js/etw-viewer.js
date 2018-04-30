var pauseToggle = false;

var mainColumnDefs = [
    //{ headerName: 'Make', field: 'make' },
    //{ headerName: 'Model', field: 'model' },
    //{ headerName: 'Price', field: 'price' }
];

var mainRowData = [
    //{ make: 'Toyota', model: 'Celica', price: 35000 },
    //{ make: 'Ford', model: 'Fairlane', price: 23000 },
    //{ make: 'Chevy', model: 'Chevelle', price: 28000 }
];

var providerColumnDefs = [
    { headerName: 'ETW (EventSource) Provider Name', field: 'providerName', width: 1000 }
];

var providerRowData = [
    { providerName: 'CompanyA-ProductA-ComponentA' },
    { providerName: 'CompanyA-ProductA-ComponentB' },
    { providerName: 'CompanyB-ProductC-ComponentD' }
];

var columnColumnDefs = [
    { headerName: 'Column Name', field: 'columnName', width: 1000, checkboxSelection: true }
];

var columnRowData = [];

// Define the grid options
var mainGridOptions = {
    rowData: mainRowData,
    columnDefs: mainColumnDefs,
    enableColResize: true,
    enableSorting: true,
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    },
    enableRangeSelection: true,
    rowSelection: 'multiple',
    pagination: true,
    paginationAutoPageSize: true
};

var providerGridOptions = {
    rowData: providerRowData,
    columnDefs: providerColumnDefs,
    enableColResize: true,
    enableSorting: true,
    defaultColDef: {
        editable: true
    },
    rowSelection: 'single'
};

var columnGridOptions = {
    rowData: columnRowData,
    columnDefs: columnColumnDefs,
    enableColResize: true,
    enableSorting: true,
    suppressRowClickSelection: true,
    rowSelection: 'multiple'
};

// Wait for the document to be loaded, otherwise
// ag-Grid will no find the dive in the document.
document.addEventListener('DOMContentLoaded', function () {
    var mainGridDiv = document.querySelector('#mainGrid');
    new agGrid.Grid(mainGridDiv, mainGridOptions);
    $('#mainGrid').contents().filter(function () {
        return this.nodeType === 3;
    }).remove();

    var providerGridDiv = document.querySelector('#providerGrid');
    new agGrid.Grid(providerGridDiv, providerGridOptions);
    $('#providerGrid').contents().filter(function () {
        return this.nodeType === 3;
    }).remove();

    var columnGridDiv = document.querySelector('#columnGrid');
    new agGrid.Grid(columnGridDiv, columnGridOptions);
    $('#columnGrid').contents().filter(function () {
        return this.nodeType === 3;
    }).remove();

    new ClipboardJS('.btn-copy', {
        text: function (trigger) {
            var textToCopy = copyRows();
            return textToCopy;
        }
    });

    $('#columnModal').on('hidden.bs.modal', function (e) {
        getColumnSelections();
    });
});

(async function () {
    await CefSharp.BindObjectAsync("jsToSharp", "bound");
})();

function setProviderNames(names) {
    providerRowData = names.map(n => ({ providerName: n }));
    providerGridOptions.api.setRowData(providerRowData);
    console.log('Updated provider names, row count: ' + names.length);
}

function getProviderNames() {
    var providerNames = jsToSharp.getProviderNames().then(function (result) {
        setProviderNames(result);
    });
}

function updateProviderNames() {
    providerGridOptions.api.stopEditing();
    providerRowData = [];
    providerGridOptions.api.forEachNode(function (node) {
        providerRowData.push(node.data);
    });
    var providerNames = providerRowData.map(item => item.providerName).join(',');
    jsToSharp.updateProviderNames(providerNames);
    console.log(providerNames);
}

function addColumn(columnName) {
    mainColumnDefs.push({ headerName: columnName, field: columnName });
    mainGridOptions.api.setColumnDefs(mainColumnDefs);

    columnGridOptions.api.updateRowData({ add: [{ columnName: columnName }] });
}

function addRow(rowJson) {
    if (!pauseToggle) {
        mainGridOptions.api.updateRowData({ add: [rowJson] });
    }
}

function clearData() {
    mainGridOptions.api.setRowData([]);
}

function removeSelectedProviderNames() {
    var selectedRows = providerGridOptions.api.getSelectedRows();
    providerGridOptions.api.updateRowData({ remove: selectedRows });

    var cell = providerGridOptions.api.getFocusedCell();
    providerGridOptions.api.getModel().rowsToDisplay[cell.rowIndex].setSelected(true);
    console.log('Remove rows');
}

function addProviderName() {
    providerGridOptions.api.updateRowData({ add: [{ providerName: 'new' }] });

    var rowIndex = providerGridOptions.api.getLastDisplayedRow()
    providerGridOptions.api.startEditingCell({ rowIndex: rowIndex, colKey: 'providerName' });
    console.log('Add row');
}

function togglePause() {
    pauseToggle = !pauseToggle;
    console.log('Toggle pause');
}

function copyRows() {
    var gridColumns = mainGridOptions.columnApi.getAllGridColumns().map(function (column) {
        return column.colDef.headerName;
    });
    var columnNames = gridColumns.join('\t');

    var selectedRows = mainGridOptions.api.getSelectedRows();
    var columnValues = selectedRows.map(function (row) {
        return gridColumns.map(function (columnName) {
            var value = row[columnName];
            if (typeof value === 'undefined') {
                return '<empty>';
            } else {
                return value;
            }
        });
    });

    var textToCopy = columnNames + '\n' + columnValues.map(row => row.join('\t')).join('\n');
    console.log('Copy rows');
    return textToCopy;
}

function autoSizeAll() {
    var allColumnIds = [];
    mainGridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    mainGridOptions.columnApi.autoSizeColumns(allColumnIds);
    console.log('Column resize');
}

function getColumnSelections() {
    var selectedRows = columnGridOptions.api.getSelectedRows();
    columnGridOptions.api.forEachNode(function (node) {
        mainGridOptions.columnApi.setColumnVisible(node.data.columnName, !node.selected);
    });
    console.log('Column Selections');
}


