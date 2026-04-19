const BASE_URL = "http://127.0.0.1:5000/api";

const params = new URLSearchParams(window.location.search);
const slotId = params.get("slotId");

const priceEl = document.getElementById("price");
const slotInfo = document.getElementById("slotInfo");

// 🔥 GET PRICE FROM BACKEND
async function loadDetails() {
    const res = await fetch(`${BASE_URL}/slots/${slotId}`);
    const slot = await res.json();

    slotInfo.innerText = `Slot: ${slot.slotNumber}`;
    priceEl.innerText = `Price: ₹${slot.price || 50}`;
}

loadDetails();

// 🔥 PAY
async function pay() {
    await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({ slotId })
    });
    window.location.href = "../index.html";
    alert("Payment Successful!");
    
}

// ❌ CANCEL
function cancel() {
    window.location.href = "../index.html";
}