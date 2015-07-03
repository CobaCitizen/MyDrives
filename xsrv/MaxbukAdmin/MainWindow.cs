using System;
using Gtk;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;

public partial class MainWindow: Gtk.Window
{
	public MainWindow () : base (Gtk.WindowType.Toplevel)
	{
		Build ();
		_initialize ();
	}

	protected void OnDeleteEvent (object sender, DeleteEventArgs a)
	{
		Application.Quit ();
		a.RetVal = true;
	}
	private void _initialize(){

		IPAddress[] ips = Dns.GetHostAddresses(Dns.GetHostName());
		if (ips.Length > 0) {
			for (var i = 0; i < ips.Length; i++) {
				var s = ips [i].ToString ();
				if (s.IndexOf ('.') != -1) {
					this.combobox1.AppendText (ips [i].ToString ());
				}
			}
			this.combobox1.Active = 0;
		}
		GetFreePort ();
	}

	protected void OnCombobox1Changed (object sender, EventArgs e)
	{
		//throw new NotImplementedException ();
	}
	public static int GetFreePort()
	{
		TcpListener tcpListener = default(TcpListener);
		int port = 0;
		try
		{
			var ipAddress = Dns.GetHostEntry("localhost").AddressList[0];

			tcpListener = new TcpListener(ipAddress, 0);
			tcpListener.Start();
			string s = tcpListener.LocalEndpoint.ToString();
			s = s.Substring(s.IndexOf("]:")+2);
			port = int.Parse(s);
			return port;
		}
		catch (SocketException)
		{
		}
		finally
		{
			if (tcpListener != null)
				tcpListener.Stop();
		}

		return port;
	}

	protected void OnButton2Clicked (object sender, EventArgs e)
	{
		this.entry1.Text = GetFreePort ().ToString ();
	}
}
