// ==================== User Storage System ====================
// Initialize users array from localStorage or create empty array
let users = JSON.parse(localStorage.getItem("moviehub_users")) || [];

// Function to save users to localStorage
function saveUsersToLocalStorage() {
    localStorage.setItem("moviehub_users", JSON.stringify(users));
}

// Function to check if email already exists
function emailExists(email) {
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Function to find user by email and password
function findUser(email, password) {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
}

// Function to register a new user
function registerUser(fullname, email, password) {
    const newUser = {
        id: users.length + 1,
        fullname: fullname,
        email: email,
        password: password,
        registeredAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsersToLocalStorage();
    return newUser;
}

// Function to login user
function loginUser(email, password) {
    const user = findUser(email, password);
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        return user;
    }
    return null;
}

// Function to logout user
function logoutUser() {
    localStorage.removeItem("currentUser");
}

// Function to get current logged-in user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

// ==================== Form Handling ====================
const form = document.getElementById("form");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Get form inputs
    const fullnameInput = document.getElementById("fullname-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const repeatPasswordInput = document.getElementById("repeat-password-input");
    
    // Determine if it's login or registration form
    const isRegistrationForm = fullnameInput !== null;
    
    // Clear previous error messages
    errorMessage.innerText = "";
    errorMessage.style.color = "#e50914";
    document.querySelectorAll("form > div").forEach(div => div.classList.remove("incorrect"));
    
    // Validate fullname FIRST if registration
    if (isRegistrationForm) {
        if (fullnameInput.value.trim() === "") {
            errorMessage.innerText = "Full name is required!";
            errorMessage.style.color = "#e50914";
            fullnameInput.parentElement.classList.add("incorrect");
            return;
        } else if (fullnameInput.value.trim().length < 2) {
            errorMessage.innerText = "Full name must be at least 2 characters!";
            errorMessage.style.color = "#e50914";
            fullnameInput.parentElement.classList.add("incorrect");
            return;
        }
    }
    
    // Validate email - SECOND
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === "") {
        errorMessage.innerText = "Email is required!";
        errorMessage.style.color = "#e50914";
        emailInput.parentElement.classList.add("incorrect");
        return;
    } else if (!emailRegex.test(emailInput.value)) {
        errorMessage.innerText = "Please enter a valid email!";
        errorMessage.style.color = "#e50914";
        emailInput.parentElement.classList.add("incorrect");
        return;
    }
    
    // Validate password - THIRD
    if (passwordInput.value === "") {
        errorMessage.innerText = "Password is required!";
        errorMessage.style.color = "#e50914";
        passwordInput.parentElement.classList.add("incorrect");
        return;
    } else if (passwordInput.value.length < 6) {
        errorMessage.innerText = "Password must be at least 6 characters!";
        errorMessage.style.color = "#e50914";
        passwordInput.parentElement.classList.add("incorrect");
        return;
    }
    
    // ==================== REGISTRATION FLOW ====================
    if (isRegistrationForm) {
        // Check if email already exists
        if (emailExists(emailInput.value)) {
            errorMessage.innerText = "This email is already registered!";
            errorMessage.style.color = "#e50914";
            emailInput.parentElement.classList.add("incorrect");
            return;
        }
        
        // Validate repeat password - FOURTH
        if (repeatPasswordInput.value === "") {
            errorMessage.innerText = "Please confirm your password!";
            errorMessage.style.color = "#e50914";
            repeatPasswordInput.parentElement.classList.add("incorrect");
            return;
        } else if (repeatPasswordInput.value !== passwordInput.value) {
            errorMessage.innerText = "Passwords do not match!";
            errorMessage.style.color = "#e50914";
            repeatPasswordInput.parentElement.classList.add("incorrect");
            return;
        }
        
        // Register user
        const newUser = registerUser(fullnameInput.value.trim(), emailInput.value.trim(), passwordInput.value);
        console.log("User registered successfully:", newUser);
        console.log("All registered users:", users);
        
        // Show success message
        errorMessage.style.color = "#4CAF50";
        errorMessage.innerText = "Registration successful!!!";
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = "./login.html";
        }, 2000);
    } 
    // ==================== LOGIN FLOW ====================
    else {
        // Try to login
        const user = loginUser(emailInput.value.trim(), passwordInput.value);
        
        if (user) {
            console.log("Login successful!", user);
            errorMessage.style.color = "#4CAF50";
            errorMessage.innerText = "Login successful!!!";
            
            // Redirect to movies page
            setTimeout(() => {
                window.location.href = "../movies.html";
            }, 1500);
        } else {
            errorMessage.innerText = "Invalid email or password!";
            errorMessage.style.color = "#e50914";
            emailInput.parentElement.classList.add("incorrect");
            passwordInput.parentElement.classList.add("incorrect");
        }
    }
});

// Reset error message color on input focus
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => {
        errorMessage.style.color = "#e50914";
    });
});

