# EtwViewer
EtwViewer was created to enable the display of live events from a set of ETW providers. The viewer was created as an experiment to combine libraries from:
* [TraceEvent](https://github.com/Microsoft/dotnet-samples/blob/master/Microsoft.Diagnostics.Tracing/TraceEvent/docs/TraceEvent.md)  
C# TraceEvent for listening to the ETW tracing
* [CEFSharp](https://github.com/cefsharp/CefSharp/blob/master/README.md)  
CefSharp for using browser UI components on a desktop application
* [ag-Grid](https://www.ag-grid.com/)  
Ag-Grid for displaying the traces in a datagrid

The motivation came from using the Diagnostics Event viewer in Visual Studio while debugging applications being developed for service fabric but wanting an ETW viewer that automatically expanded the event payload and enabled hiding of columns. Additionally, there were times when an application was published to service fabric and Visual Studio was not available. Being able to drop a tool onto a machine in the virtual machine scale set to watch the events was also helpful.

NOTE: The EtwViewer can listen for events on only the local system. It cannot listen remotely, such as across a network.

\<END>
