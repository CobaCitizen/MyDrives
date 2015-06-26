using System;

namespace xsrv
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			string myFolder = @"E:\Develops\xsrv\site\";

			CobaServer server = new CobaServer(myFolder,"192.168.1.5",3030);

			Console.WriteLine(server.ToString());
			Console.Read ();

			server.Stop();


		}
	}
}
