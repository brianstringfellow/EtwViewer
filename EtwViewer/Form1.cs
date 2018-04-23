using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

using Microsoft.Diagnostics.Tracing;
using Microsoft.Diagnostics.Tracing.Session;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using CefSharp;
using CefSharp.WinForms;

namespace EtwViewer
{
    public partial class Form1 : Form
    {
        private ChromiumWebBrowser _chromiumWebBrowser;
        private JsToSharp _jsToSharp;
        private TraceEventSession _etwSession;
        private HashSet<string> _columnNames = new HashSet<string>();

        public string[] ProviderNames { get; private set; }

        public Form1()
        {
            InitializeComponent();
            InitializeChromium();
            Controls.Add(_chromiumWebBrowser);

            ProviderNames = JsonConvert.DeserializeObject<string[]>(Properties.Settings.Default.ProviderNames);

            Task.Run(() => WatchForEtwEvents());
        }

        public void UpdateProviderNames(string[] providerNames)
        {
            var removed = ProviderNames.Except(providerNames);
            var added = providerNames.Except(ProviderNames);

            foreach (var name in removed)
            {
                _etwSession.DisableProvider(name);
            }

            foreach (var name in added)
            {
                _etwSession.EnableProvider(name);
            }

            ProviderNames = providerNames;

            Properties.Settings.Default.ProviderNames = JsonConvert.SerializeObject(ProviderNames);
            Properties.Settings.Default.Save();
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

            _jsToSharp = new JsToSharp(_chromiumWebBrowser, this);
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
            _etwSession.Source.Dynamic.All += OnEtwEvent;

            foreach(var providerName in ProviderNames)
            {
                _etwSession.EnableProvider(providerName);
            }

            _etwSession.Source.Process();
        }

        private void OnEtwEvent(TraceEvent traceEvent)
        {
            JObject row = new JObject();
            string pre = "#";
            AddFieldData(row, pre + nameof(traceEvent.ProviderName), traceEvent.ProviderName);
            AddFieldData(row, pre + nameof(traceEvent.EventName), traceEvent.EventName);
            AddFieldData(row, pre + nameof(traceEvent.TaskName), traceEvent.TaskName);
            AddFieldData(row, pre + nameof(traceEvent.OpcodeName), traceEvent.OpcodeName);
            AddFieldData(row, pre + nameof(traceEvent.TimeStamp), traceEvent.TimeStamp.ToString("o"));
            AddFieldData(row, pre + nameof(traceEvent.FormattedMessage), traceEvent.FormattedMessage);

            foreach (var payloadKey in traceEvent.PayloadNames)
            {
                string payloadValue;
                try
                {
                    payloadValue = traceEvent.PayloadByName(payloadKey).ToString();
                }
                catch (Exception)
                {
                    payloadValue = "Error extracting payload";
                }

                AddFieldData(row, payloadKey, payloadValue);
            }

            string script = $"addRow({row})";
            _chromiumWebBrowser.GetMainFrame().ExecuteJavaScriptAsync(script);
        }

        private void AddFieldData(JObject jsonObject, string key, string value)
        {
            if (!_columnNames.Contains(key))
            {
                _columnNames.Add(key);
                string script = $"addColumn('{key}');";
                _chromiumWebBrowser.GetMainFrame().ExecuteJavaScriptAsync(script);
            }

            if (value == null)
            {
                value = "<null>";
            }

            jsonObject.Add(key, JToken.FromObject(value));
        }
    }
}
