var mainColumnDefs = [
    { headerName: 'Make', field: 'make' },
    { headerName: 'Model', field: 'model' },
    { headerName: 'Price', field: 'price' }
];

var mainRowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Fairlane', price: 23000 },
    { make: 'Chevy', model: 'Chevelle', price: 28000 }
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

    var modalGridDiv = document.querySelector('#modalGrid');
    new agGrid.Grid(modalGridDiv, modalGridOptions);
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
    var providerNames = modalRowData.map(item => item.providerName).join(',');
    jsToSharp.updateProviderNames(providerNames);
    console.log(providerNames);
}