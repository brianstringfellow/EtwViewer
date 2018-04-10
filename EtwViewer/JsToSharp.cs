using CefSharp;
using CefSharp.WinForms;

namespace EtwViewer
{
    public class JsToSharp
    {
        private static ChromiumWebBrowser _instanceBrowser;

        public JsToSharp(ChromiumWebBrowser browser)
        {
            _instanceBrowser = browser;
        }

        public void showDevTools()
        {
            _instanceBrowser.ShowDevTools();
        }

        public void reload()
        {
            _instanceBrowser.Reload();
        }
    }
}