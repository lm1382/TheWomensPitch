<?php
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") { //post request 
    $firstname = $_POST['firstname']; //retrieve the form inputs from user
    $surname = $_POST['surname'];
    $email = $_POST['email'];
    $email = filter_var($email, FILTER_SANITIZE_EMAIL); //ensure valid/safe email

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) { //check if the email is valid 
        
        $emailcheckStmt = $conn->prepare("SELECT email FROM subscribers WHERE email = ?");
        $emailcheckStmt->bind_param("s", $email);  //bind input to prevent injection
        $emailcheckStmt->execute();
        $emailcheckStmt->store_result();

        if ($emailcheckStmt->num_rows > 0) {
            header("Location: https://lm1382.brighton.domains/TheWomen'sPitch/AboutUsAlreadySubscribed.html");
            exit();

        } else {
            $stmt = $conn->prepare("INSERT INTO subscribers (firstname, surname, email) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $firstname, $surname, $email); //bind user input as safe strings
        
        if ($stmt->execute()) {
            header("Location: https://lm1382.brighton.domains/TheWomen'sPitch/AboutUsSuccess.html");
            exit();
        }

        if ($stmt->execute()) {
            echo "Thank you for subscribing to the Women's Pitch newsletter! Please click the back button to return to The Women's Pitch"; 
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    }
    $emailcheckStmt->close();
    } else {
        echo "Invalid email format!";
    }
}

$conn->close(); //close db connection
?>