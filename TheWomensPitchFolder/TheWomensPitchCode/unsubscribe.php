<?php
include 'db_connect.php';

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
} catch (PDOException $e) {
    die("DB Connection failed: " . $e->getMessage());
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['email'])) {
    $email = trim($_POST['email']);

    //delete query
    $stmt = $pdo->prepare("DELETE FROM subscribers WHERE email = :email");
    $stmt->bindParam(':email', $email);

    if ($stmt->execute()) {
        header("Location: https://lm1382.brighton.domains/TheWomen'sPitch/unsubscribed.html");
        exit();
    } else {
        echo "Something went wrong, please try again!";
    }
}

?>