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

var modalColumnDefs = [
    { headerName: 'ETW (EventSource) Provider Name', field: 'providerName', width: 1000 },
];

var modalRowData = [
    { providerName: 'CompanyA-ProductA-ComponentA' },
    { providerName: 'CompanyA-ProductA-ComponentB' },
    { providerName: 'CompanyB-ProductC-ComponentD' }
];

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

var modalGridOptions = {
    rowData: modalRowData,
    columnDefs: modalColumnDefs,
    enableColResize: true,
    enableSorting: true,
    defaultColDef: {
        editable: true
    },
    enableRangeSelection: true,
    rowSelection: 'multiple',
    pagination: true,
    paginationAutoPageSize: true
};

// Wait for the document to be loaded, otherwise
// ag-Grid will no find the dive in the document.
document.addEventListener('DOMContentLoaded', function () {
    var mainGridDiv = document.querySelector('#mainGrid');
    new agGrid.Grid(mainGridDiv, mainGridOptions);
    $('#mainGrid').contents().filter(function () {
        return this.nodeType === 3;
    }).remove();

    var modalGridDiv = document.querySelector('#modalGrid');
    new agGrid.Grid(modalGridDiv, modalGridOptions);
    $('#modalGrid').contents().filter(function () {
        return this.nodeType === 3;
    }).remove();

    new ClipboardJS('.btn-copy', {
        text: function (trigger) {
            var textToCopy = copyRows();
            return textToCopy;
        }
    });
});

(async function () {
    await CefSharp.BindObjectAsync("jsToSharp", "bound");
})();

function setProviderNames(names) {
    modalRowData = names.map(n => ({ providerName: n }));
    modalGridOptions.api.setRowData(modalRowData);
    console.log('Updated provider names, row count: ' + names.length);
}

function getProviderNames() {
    var providerNames = jsToSharp.getProviderNames().then(function (result) {
        setProviderNames(result);
    });
}

function updateProviderNames() {
    modalRowData = [];
    modalGridOptions.api.forEachNode(function (node) {
        modalRowData.push(node.data);
    });
    var providerNames = modalRowData.map(item => item.providerName).join(',');
    jsToSharp.updateProviderNames(providerNames);
    console.log(providerNames);
}

function addColumn(columnName) {
    mainColumnDefs.push({ headerName: columnName, field: columnName });
    mainGridOptions.api.setColumnDefs(mainColumnDefs);
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
    var selectedRows = modalGridOptions.api.getSelectedRows();
    modalGridOptions.api.updateRowData({ remove: selectedRows });
    console.log('Remove rows');
}

function addProviderName() {
    modalGridOptions.api.updateRowData({ add: [{ providerName: 'new' }] });
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
                return '<empty>'
            } else {
                return value;
            }
        });
    })

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


