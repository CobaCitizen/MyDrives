using System;

namespace xsrv
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			Console.SetBufferSize (100, 100);
			//string myFolder = @"E:\Develops\xsrv\site\";
			string workingFolder = @"E:\github\MyDrives\site\";

//			Database db = new Database ();
//			db.Create (workingFolder + "maxbuk.db");
			CobaServer server = new CobaServer(workingFolder,"192.168.1.5",3030);

			Console.WriteLine(server.ToString());
			Console.Read ();

			server.Stop();


		}
	}
}
