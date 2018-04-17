var columnDefs = [
    { headerName: 'Make', field: 'make' },
    { headerName: 'Model', field: 'model' },
    { headerName: 'Price', field: 'price' }
];

var rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Fairlane', price: 23000 },
    { make: 'Chevy', model: 'Chevelle', price: 28000 }
];

// Define the grid options
var gridOptions = {
    rowData: rowData,
    columnDefs: columnDefs,
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

// Wait for the document to be loaded, otherwise
// ag-Grid will no find the dive in the document.
document.addEventListener('DOMContentLoaded', function () {
    var mainGridDiv = document.querySelector('#mainGrid');
    new agGrid.Grid(mainGridDiv, gridOptions);
});

(async function () {
    await CefSharp.BindObjectAsync("jsToSharp", "bound");
})();