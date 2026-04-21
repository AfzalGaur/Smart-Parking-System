const loader = document.getElementById("loader");
const BASE_URL = "https://smart-parking-system-5vq0.onrender.com//api";
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}
async function fetchSlots() {
    loader.style.display = "block";

    try {
        const [slotsRes, bookingsRes] = await Promise.all([
            fetch(`${BASE_URL}/slots`),
            fetch(`${BASE_URL}/bookings`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })
        ]);

        const slots = await slotsRes.json();
        const bookings = await bookingsRes.json();

        placeSlots(slots, bookings);

    } catch (err) {
        console.error("Error loading slots:", err);
        loader.innerText = "Failed to load";
    }

    loader.style.display = "none";
}

// 🔥 PLACE SLOTS IN UI
function placeSlots(slots, bookings) {
    const rowA = document.getElementById("rowA");
    const rowB = document.getElementById("rowB");
    const rowC = document.getElementById("rowC");
    const rowD = document.getElementById("rowD");
    const rowE = document.getElementById("rowE");

    rowA.innerHTML = "";
    rowB.innerHTML = "";
    rowC.innerHTML = "";
    rowD.innerHTML = "";
    rowE.innerHTML = "";

    const token = localStorage.getItem("token");
    const userId = parseJwt(token).id; // 🔥 get logged-in user

    slots.forEach(slot => {
        const booking = bookings.find(
            b => b.slot === slot._id || b.slot?._id === slot._id
        );

        const div = document.createElement("div");

        let content = `<h4>${slot.slotNumber}</h4>`;

        if (!booking) {
            // 🟢 AVAILABLE
            div.className = "slot available";
            content += `<p>₹${slot.price}</p>`;
            content += `<button onclick="bookSlot('${slot._id}')">Book</button>`;
        } else if (booking.user === userId) {
            // 🟡 YOUR BOOKING
            div.className = "slot mine";
            content += `<p>Booked</p>`;
            content += `<button onclick="cancelBooking('${booking._id}')">Cancel</button>`;
        } else {
            // 🔴 OTHER USER
            div.className = "slot reserved";
            content += `<span>Reserved</span>`;
        }

        div.innerHTML = content;

        const rowLetter = slot.slotNumber.charAt(0);

        if (rowLetter === "A") rowA.appendChild(div);
        else if (rowLetter === "B") rowB.appendChild(div);
        else if (rowLetter === "C") rowC.appendChild(div);
        else if (rowLetter === "D") rowD.appendChild(div);
        else if (rowLetter === "E") rowE.appendChild(div);
    });
}

// 🔥 BOOK SLOT (ONLY ONE VERSION)
function bookSlot(id) {
    window.location.href = `payment/payment.html?slotId=${id}`;
}

// 🔥 CANCEL BOOKING
async function cancelBooking(id) {
    if (!confirm("Cancel this booking? Money will not be refunded!")) return;

    await fetch(`${BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    });

    fetchSlots();
}

// 🚀 START
fetchSlots();

setInterval(fetchSlots, 2000); 