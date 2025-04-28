document.addEventListener('DOMContentLoaded', () => { //wait for HTML to fully load
    document.addEventListener('click', (event) => { //to listen for any click events on the page
        const clickedButton = event.target;

       
        //timeline popups + button text change
        if (clickedButton.classList.contains('popup-btn')) { //check if clicked element is timeline popupbtn 
            const popupId = clickedButton.dataset.popupOpen;
            const popup = document.getElementById(popupId);

            if (popup) {
                const isVisible = popup.style.display === 'block';
                popup.style.display = isVisible ? 'none' : 'block'; //toggle the visibility
                clickedButton.textContent = isVisible ? 'Read More' : 'Read Less'; //change button text when opened
            }
            return; 
        }
    });
});

//home page cards clickable to take user to pages
function makeHomeCardsClickable() {
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function () {
            window.location.href = this.getAttribute("onClick");
        });
    });
}
makeHomeCardsClickable();


function exploreNowDropdown() {
    const button = document.getElementById("exploreDropdown");
    const menu = document.getElementById("exploreMenu");

    button.addEventListener("click", function (event) {
        menu.classList.toggle("active");
        event.stopPropagation(); 
    });

    //close dropdown if clicked outside button
    document.addEventListener("click", function (event) {
        if (!button.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove("active");
        }
    });
}
exploreNowDropdown();



