

using System;
using SQLite;

namespace xsrv
{
	public class Person
	{
		[PrimaryKey, AutoIncrement]
		public int ID { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
	}
	public class Database
	{
		public Database ()
		{
		}
		public void Create(string dbname){
			using (var conn= new SQLite.SQLiteConnection(dbname))
			{
				conn.CreateTable<Person>();
			}
		}
	}
}

