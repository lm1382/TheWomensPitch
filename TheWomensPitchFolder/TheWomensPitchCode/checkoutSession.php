<?php
require __DIR__ . '/../vendor/autoload.php'; //stripe php sdk 


//allows backend to make API call to stripe

header('Content-Type: application/json'); //tells frontend to expect json response

//frontend JS sends donation amount
$input = json_decode(file_get_contents('php://input'), true);
$amount = isset($input['amount']) ? $input['amount'] : 0;

//prevent user from being able to enter invalid amount
if ($amount <= 0) {
    echo json_encode(['error' => 'Not a valid donation amount, please try again.']);
    http_response_code(400);
    exit();
}

$YOUR_DOMAIN = "https://lm1382.brighton.domains/TheWomen'sPitch"; //my website domain for redirection after payment

try {
    $donationAmount = isset($_POST['amount']) ? (int) $_POST['amount'] * 100 : 500; //convert amount to pence as this is what Stripe expects
    
    //create a Stripe checkout session
    $checkout_session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'gbp',
                'product_data' => [
                    'name' => 'Grassroots Football Donation',
                ],
                'unit_amount' => $amount, //amount in pence from user input
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => $YOUR_DOMAIN . '/success.html',  //takes user back to website if success or cancelled payments
        'cancel_url' => $YOUR_DOMAIN . '/cancel.html',    
    ]);

    echo json_encode(['id' => $checkout_session->id]); //sends the session ID to the frontend
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
