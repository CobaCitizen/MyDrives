<?php

$dbhost = 'maxbuk.mysql.ukraine.com.ua';
$dbuser = 'maxbuk_db';
$dbpass = 'bukshovan2009';
$dbname = 'maxbuk_db;

//Connecting to DB
$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error connecting to mysql');
mysql_select_db($dbname);

$query  = "SELECT * FROM users";
$result = mysql_query($query);
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
echo "<MessageXML>";
while($row = mysql_fetch_array($result, MYSQL_ASSOC))
{
 echo "<Data>"."<Email>{$row['email']}</Email>"."<Name>{$row['name']}</Name>"."<Password>{$row['password']}</Password>"."<Question>{$row['question']}</Question>"."<Answer>{$row['answer']}</Answer>"."</Data>";
} 
echo "</MessageXML>";
mysql_close($conn);

?>