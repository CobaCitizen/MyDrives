using System;

namespace MaxbukAdmin
{
	public partial class EditDialog : Gtk.Dialog
	{
		FileFolderInfo _info = null;
		public EditDialog (FileFolderInfo  info)
		{
			_info = info;
			this.Build ();
			_chooseFolder.Action = Gtk.FileChooserAction.SelectFolder;
			_chooseFolder.SetFilename (_info.path);
		}

		protected void OnButtonOkClicked (object sender, EventArgs e)
		{
			throw new NotImplementedException ();
		}

		protected void OnButtonCancelClicked (object sender, EventArgs e)
		{
			this.HideAll ();
			//this.Destroy ();
		}
	}
}

