using System;
using Gtk;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.IO;
using MaxbukAdmin;

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
		_loadPublicFolders ();
		_initTreeView ();
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
	private  void _initTreeView ()
	{
		// Create a Window
		//Gtk.Window window = new Gtk.Window ("TreeView Example");
		//window.SetSizeRequest (500,200);


		// Create our TreeView

		// Create a column for the artist name
		Gtk.TreeViewColumn folderColumn = new Gtk.TreeViewColumn ();
		folderColumn.Title = "Folder";
		folderColumn.MaxWidth = 300;

		Gtk.CellRendererText folderNameCell = new Gtk.CellRendererText ();
		folderNameCell.Editable = true;
		folderColumn.PackStart (folderNameCell, true);
		folderColumn.AddAttribute (folderNameCell, "text", 0);
		this.treeview1.AppendColumn (folderColumn);

		// Create a column for the song title
		Gtk.TreeViewColumn songColumn = new Gtk.TreeViewColumn ();
		songColumn.Title = "Path";
		Gtk.CellRendererText songTitleCell = new Gtk.CellRendererText ();
		songColumn.PackStart (songTitleCell, true);

		// Add the columns to the TreeView
		this.treeview1.AppendColumn (songColumn);

		songColumn.AddAttribute (songTitleCell, "text", 1);

		// Create a model that will hold two strings - Artist Name and Song Title
		Gtk.ListStore data = new Gtk.ListStore (typeof (string), typeof (string));
		foreach (var item in _disks) {
			data.AppendValues (item.name, item.path);
		}

		//Gtk.TreeIter iter = musicListStore.AppendValues ("Dance");
		//musicListStore.AppendValues (iter, "Fannypack", "Nu Nu (Yeah Yeah) (double j and haze radio edit)");

		//iter = musicListStore.AppendValues ("Hip-hop");
		//musicListStore.AppendValues (iter, "Nelly", "Country Grammer");


		// Assign the model to the TreeView
		this.treeview1.Model = data;
	//	this.fixed1.ShowAll ();
		// Show the window and everything on it
		//window.ShowAll ();

	}


	private List<FileFolderInfo> _disks;
	private void _loadPublicFolders()
	{
		string workingFolder = AppDomain.CurrentDomain.BaseDirectory + "..\\..\\..\\..\\site\\";
		string filename = workingFolder + @"data\folders.json";
		string s = File.ReadAllText(filename,System.Text.Encoding.UTF8);
		var ser = new System.Web.Script.Serialization.JavaScriptSerializer ();
		{
			_disks = ser.Deserialize<List<FileFolderInfo>> (s);
		}
	}

	protected void OnTreeview1CursorChanged (object sender, EventArgs e)
	{
		//throw new NotImplementedException ();
	}

	protected void OnTreeview1RowActivated (object o, RowActivatedArgs args)
	{
		if (args.Path.Indices.Length == 1) {
			int index = args.Path.Indices [0];
			using (MaxbukAdmin.EditDialog frm = new MaxbukAdmin.EditDialog (_disks[index])) {
				frm.TransientFor = this;
				frm.Modal = true;
				frm.SetPosition(WindowPosition.CenterOnParent);
				frm.ShowAll ();

				ResponseType response = (ResponseType)frm.Run ();

			}

		}
		//throw new NotImplementedException ();
	}

}
