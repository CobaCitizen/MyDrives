<?php

$server = "maxbuk.mysql.ukraine.com.ua";
$dbname = "maxbuk_db";
$user = "maxbuk_db";
$password = "bukshovan2009";

$conn = new mysqli($server, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

  header("Content-Type: text/plain; charset=windows-1251;");
  //header("Content-Type: application/json;  charset=windows-1251;");
  //header("Content-Type: text/plain; charset=utf8");
  header("Cache-Control: no-cache");
  
  $sql = "SELECT * FROM mb_servers";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) 
  {
      echo "[";
      $i = 0;
      while($row = $result->fetch_assoc()) 
      {
          if($i >0)
          {
            echo ",";
          }
          echo "{";
         // $rname=mb_convert_encoding($row["name"], "UTF-8","WINDOWS-1252");
         $rname = $row["name"];
          echo 'id:"' . $row["id"] . '",name:"' . $rname . '",ip:"'
           . $row["ip"] . '",port:"' . $row["port"] . '",regtime:"';
          echo $row["regtime"] . '"'; 
          echo "}";
          $i = $i + 1;
      }
      echo "]";
  }
  else
  {
     echo "[]";
  }
  $conn->close();
?>
