document.addEventListener("DOMContentLoaded", function () {
    const stripe = Stripe("pk_test_51Qwor403JJcHiLcA2UboOjl3t0C2BhVuJmPiYOraam9cyCbCEBvy9X68CQo5873VHgiAtZWv01WMgjaG3pZ238hS00yiz3yZI0"); //initialise stripe using my public test key

    document.getElementById("checkout-button").addEventListener("click", async () => { //wait for button to be clicked 
        //get donation amount from user input
        const amount = document.getElementById("donation-amount").value;
        
        //check the users entered a valid amount
        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid donation amount.");
            return;
        }

        // Send the donation amount to your PHP backend
        const response = await fetch("/TheWomen'sPitch//checkoutSession.php", { //sends request to php file
            method: "POST", //not displayed in the url
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: amount * 100 }) //convert amount to pence
        });

        const session = await response.json(); //concert to json format

        if (session.id) {
            //direct to stripe checkoit if successful creation
            stripe.redirectToCheckout({ sessionId: session.id });
        } else {
            console.error("Error creating Stripe session");
        }
    });
});

