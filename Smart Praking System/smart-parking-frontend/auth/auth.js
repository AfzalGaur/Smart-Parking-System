const BASE_URL = "http://127.0.0.1:5000/api";

async function loginUser(email, password) {
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "../index.html"; // ✅ FIXED
        } else {
            alert(data.message || "Login failed");
        }

    } catch {
        alert("Server error");
    }
}

async function registerUser(email, password) {
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Registered successfully");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Registration failed");
        }

    } catch {
        alert("Server error");
    }
}

function checkAuth() {
    if (!localStorage.getItem("token")) {
        window.location.href = "auth/login.html";
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "auth/login.html";
}