document.addEventListener("DOMContentLoaded", () => {
    const bookButtons = document.querySelectorAll(".book-btn");
    const roomSelect = document.getElementById("room");
    const bookingSection = document.querySelector(".booking-form");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const checkInInput = document.getElementById("date");
    const checkOutInput = document.getElementById("checkout-date");
    const submitButton = document.querySelector("button[type='submit']");

    // ✅ Prevent past dates from being selected
    const today = new Date().toISOString().split("T")[0];
    checkInInput.setAttribute("min", today);
    checkOutInput.setAttribute("min", today);

    // ✅ Ensure check-out date is after check-in date
    checkInInput.addEventListener("change", () => {
        checkOutInput.value = "";
        checkOutInput.setAttribute("min", checkInInput.value);
    });

    checkOutInput.addEventListener("change", () => {
        if (checkOutInput.value <= checkInInput.value) {
            alert("Check-out date must be after the check-in date!");
            checkOutInput.value = "";
        }
    });

    // ✅ Smooth scrolling to booking section
    bookButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const roomType = event.target.getAttribute("data-room");
            roomSelect.value = roomType;

            window.scrollTo({
                top: bookingSection.offsetTop,
                behavior: "smooth"
            });

            setTimeout(() => {
                nameInput.style.border = "2px solid red";
                nameInput.focus();
            }, 1500);

            setTimeout(() => {
                nameInput.style.border = "";
            }, 5000);
        });
    });

    // ✅ Handle form submission
    document.getElementById("booking-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        // Show loading overlay
        document.getElementById("loading-overlay").style.display = "flex";

        const bookingDetails = {
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value || "Not provided",
            checkInDate: checkInInput.value,
            checkOutDate: checkOutInput.value,
            roomType: roomSelect.value
        };

        try {
            // 👉 IMPORTANT: USE YOUR DEPLOYED RENDER BACKEND URL
            const response = await fetch("https://pbh-backend.onrender.com", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingDetails)
            });

            if (response.ok) {
                alert(`Thank you, ${bookingDetails.name}! Your booking request has been sent.`);

                // Reset form
                nameInput.value = "";
                phoneInput.value = "";
                emailInput.value = "";
                checkInInput.value = "";
                checkOutInput.value = "";
                roomSelect.value = "Economy Single Room"; 
            } else {
                const result = await response.json();
                alert("Error sending booking details: " + result.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }

        // Hide loading overlay
        document.getElementById("loading-overlay").style.display = "none";
    });
});
