const loadUsersButton = document.getElementById('load-users');
const userList = document.getElementById('user-list');

// Initialize marks for users
const userMarks = {};

// Fetch and display user data
async function loadUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();

        userList.innerHTML = ''; // Clear any existing user data

        // Loop through each user and create a card for each
        for (const user of users) {
            // Initialize user marks to the number of todos
            userMarks[user.id] = 20; // Starting marks for each user

            const userCard = document.createElement('div');
            userCard.className = 'user-card col-md-6 col-lg-4 mb-4 card shadow-sm p-3';

            // Populate the user card with name, email, address, and button to view todos
            userCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${user.name}</h5>
                    <p class="card-text"><strong>Email:</strong> ${user.email}</p>
                    <p class="card-text"><strong>Address:</strong> ${user.address.street}, ${user.address.city}</p>
                    <p class="card-text"><strong>Marks:</strong> <span class="marks" id="marks-${user.id}">${userMarks[user.id]}</span></p>
                    <button class="btn btn-outline-secondary mt-2" onclick="loadTodos(${user.id}, this)">View Todos</button>
                    <div class="todos mt-3" style="display: none;"></div>
                </div>
            `;

            userList.appendChild(userCard);
        }
    } catch (error) {
        userList.innerHTML = '<p>Failed to load user data.</p>';
        console.error("Error fetching user data:", error);
    }
}

// Fetch and display todos for a specific user
async function loadTodos(userId, button) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
        const todos = await response.json();

        const todosContainer = button.nextElementSibling; // Target the todos div
        todosContainer.innerHTML = ''; // Clear any existing todos

        // Display each todo with a delete button
        todos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = 'todo mb-2 p-2 border rounded bg-light';

            todoElement.innerHTML = `
                <p><strong>${todo.title}</strong></p>
                <small class="text-muted">Completed: ${todo.completed}</small>
                <button class="btn btn-sm btn-danger mt-2 delete-todo">Delete</button>
            `;

            // Add event listener to delete button
            todoElement.querySelector('.delete-todo').addEventListener('click', () => {
                todoElement.remove(); // Remove todo from the DOM
                updateMarks(userId); // Update marks when a todo is deleted
            });

            todosContainer.appendChild(todoElement);
        });

        // Toggle todos visibility and button text
        todosContainer.style.display = todosContainer.style.display === 'none' ? 'block' : 'none';
        button.textContent = todosContainer.style.display === 'none' ? 'View Todos' : 'Hide Todos';

    } catch (error) {
        console.error("Error fetching todos:", error);
        button.nextElementSibling.innerHTML = '<p>Failed to load todos.</p>';
    }
}

// Update marks for the user when a todo is deleted
function updateMarks(userId) {
    if (userMarks[userId] > 0) {
        userMarks[userId]--; // Decrease marks by 1
    }
    document.getElementById(`marks-${userId}`).textContent = userMarks[userId]; // Update marks display
}

// Event listener for loading users
loadUsersButton.addEventListener('click', loadUsers);
