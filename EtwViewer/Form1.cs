using System.Diagnostics;
using System.Windows.Forms;

using CefSharp;
using CefSharp.WinForms;

namespace EtwViewer
{
    public partial class Form1 : Form
    {
        private ChromiumWebBrowser _chromiumWebBrowser;
        private JsToSharp _jsToSharp;

        public Form1()
        {
            InitializeComponent();
            InitializeChromium();
            Controls.Add(_chromiumWebBrowser);
        }

        private void InitializeChromium()
        {
            var settings = new CefSettings();
            Cef.Initialize(settings);

            var address = $@"{Application.StartupPath}\HtmlResources\html\index.html";
            _chromiumWebBrowser = new ChromiumWebBrowser(address);

            _chromiumWebBrowser.Dock = DockStyle.Fill;
            _chromiumWebBrowser.IsBrowserInitializedChanged += OnBrowserInitialized;
            _chromiumWebBrowser.FrameLoadEnd += OnFrameLoadEnd;

            _jsToSharp = new JsToSharp(_chromiumWebBrowser);
            _chromiumWebBrowser.JavascriptObjectRepository.Register("jsToSharp", _jsToSharp, true);

            var browserSettings = new BrowserSettings
            {
                FileAccessFromFileUrls = CefState.Enabled,
                UniversalAccessFromFileUrls = CefState.Enabled
            };

            _chromiumWebBrowser.BrowserSettings = browserSettings;
        }

        private void OnBrowserInitialized(object sender, IsBrowserInitializedChangedEventArgs e)
        {
            Debug.WriteLine("Browser initialized");
            _chromiumWebBrowser.ShowDevTools();
        }

        private void OnFrameLoadEnd(object sender, FrameLoadEndEventArgs e)
        {
            Debug.WriteLine("Frame load end");
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            Cef.Shutdown();
        }
    }
}
