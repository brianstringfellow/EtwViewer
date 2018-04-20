using System.Diagnostics;
using CefSharp;
using CefSharp.WinForms;

namespace EtwViewer
{
    public class JsToSharp
    {
        private static ChromiumWebBrowser _instanceBrowser;
        private Form1 _hostForm;

        public JsToSharp(ChromiumWebBrowser browser, Form1 hostForm)
        {
            _instanceBrowser = browser;
            _hostForm = hostForm;
        }

        public void showDevTools()
        {
            _instanceBrowser.ShowDevTools();
        }

        public void reload()
        {
            _instanceBrowser.Reload();
        }

        public void updateProviderNames(string providerNames)
        {
            var names = providerNames.Split(',');
            Debug.WriteLine($"updateProviderNames, count: {names.Length}");
            _hostForm.UpdateProviderNames(names);
        }

        public string[] getProviderNames()
        {
            Debug.WriteLine("getProviderNames");
            return _hostForm.ProviderNames;
        }
    }
}