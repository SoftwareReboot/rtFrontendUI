const BASE_URL = "http://localhost:8080/menu";
const requesterId = 1; // change this to a real admin/user ID

async function loadMenu() {
    const res = await fetch(BASE_URL);
    const data = await res.json();

    const container = document.getElementById("menu-list");
    container.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <hr>
            <h3>${item.name} - $${item.price}</h3>
            <p>${item.description}</p>
            ${item.image ? `<img src="http://localhost:8080/uploads/${item.image}" width="150">` : ""}
            <br><br>
            <button onclick="deleteItem(${item.id})">Delete</button>
        `;
        container.appendChild(div);
    });
}

async function deleteItem(itemId) {
    await fetch(`${BASE_URL}/delete/${requesterId}/${itemId}`, { method: "DELETE" });
    loadMenu();
}

document.getElementById("menu-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = document.getElementById("image").files[0];

    if (file) {
        // 🔥 Use multipart upload endpoint
        const formData = new FormData();
        
        const menuItem = {
            name: document.getElementById("name").value,
            price: document.getElementById("price").value,
            description: document.getElementById("description").value
        };

        formData.append("file", file);
        formData.append("menuItem", JSON.stringify(menuItem));

        await fetch(`${BASE_URL}/create/with-image/${requesterId}`, {
            method: "POST",
            body: formData
        });
    } else {
        // 🔥 Create without image
        const menuItem = {
            name: document.getElementById("name").value,
            price: document.getElementById("price").value,
            description: document.getElementById("description").value
        };

        await fetch(`${BASE_URL}/create/${requesterId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(menuItem)
        });
    }

    e.target.reset();
    loadMenu();
});

loadMenu();
