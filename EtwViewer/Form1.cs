using System.Diagnostics;
using System.Threading.Tasks;
using System.Windows.Forms;

using Microsoft.Diagnostics.Tracing.Session;

using CefSharp;
using CefSharp.WinForms;

namespace EtwViewer
{
    public partial class Form1 : Form
    {
        private ChromiumWebBrowser _chromiumWebBrowser;
        private JsToSharp _jsToSharp;
        private TraceEventSession _etwSession;

        public Form1()
        {
            InitializeComponent();
            InitializeChromium();
            Controls.Add(_chromiumWebBrowser);

            Task.Run(() => WatchForEtwEvents());
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
        }

        private void OnFrameLoadEnd(object sender, FrameLoadEndEventArgs e)
        {
            Debug.WriteLine("Frame load end");
        }

        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            _etwSession.Stop();
            Cef.Shutdown();
        }

        private void WatchForEtwEvents()
        {
            _etwSession = new TraceEventSession("EtwViewer");
            _etwSession.Source.Process();
        }
    }
}
