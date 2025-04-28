<?php
$servername = "localhost";
$username = "lm1382_subscriber";
$password = "QV*Ul3,Jm)X-";
$dbname = "lm1382_newsletterSubscribe"; 

//create the connection
$conn = new mysqli($servername, $username, $password, $dbname);

//check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//select the database
$conn->select_db($dbname) or die("Database selection failed: " . $conn->error);
