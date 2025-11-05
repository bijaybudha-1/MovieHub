🎥 MovieHub – Film Information & Rating Website

MovieHub is a web-based project developed as part of a university Web Design and Development assignment.
The website allows users to browse movies, view posters and trailers, explore detailed descriptions, and submit ratings and reviews.

🌐 Key Features

🎬 Interactive homepage showcasing featured movies

🧩 10+ interlinked HTML pages (Home, Movies, Ratings, Gallery, Reviews, etc.)

🎨 Modern and responsive layout using CSS

⭐ Star-based rating system using JavaScript

📷 Multimedia integration (images, trailers, and videos)

🧭 Easy navigation with consistent header and footer

🧾 Client-side form validation for reviews and contact pages

🌗 Optional dark/light mode toggle

🧱 Tech Stack

HTML5 – Structure and content

CSS3 – Styling and responsiveness

JavaScript (ES6) – Interactivity and validation

Visual Studio / Dreamweaver – Development tools

## Folder/File Structure
MovieHub/
│
├── index.html                    # Main homepage
│
├── pages/                        # All sub-pages go here
│   ├── about.html
│   ├── movies.html
│   ├── movie-details.html
│   ├── ratings.html
│   ├── gallery.html
│   ├── reviews.html
│   ├── news.html
│   ├── contact.html
│   └── login.html
│
├── assets/                       # All static files (media, style, scripts)
│   ├── css/
│   │   ├── style.css             # Main stylesheet
│   │   ├── responsive.css        # Media queries for mobile/tablet
│   │   └── components.css        # Optional: Reusable components (buttons, cards)
│   │
│   ├── js/
│   │   ├── main.js               # Main JavaScript file
│   │   ├── form-validation.js    # Handles form validations
│   │   ├── rating.js             # Handles star ratings
│   │   └── slider.js             # Optional: image slider or carousel
│   │
│   ├── images/
│   │   ├── logo/
│   │   │   └── logo.png
│   │   ├── movies/
│   │   │   ├── movie1.jpg
│   │   │   ├── movie2.jpg
│   │   │   └── ...
│   │   ├── gallery/
│   │   │   ├── scene1.jpg
│   │   │   └── scene2.jpg
│   │   └── icons/
│   │       ├── star.svg
│   │       └── user.png
│   │
│   ├── videos/
│   │   ├── trailer1.mp4
│   │   └── trailer2.mp4
│   │
│   └── fonts/                    # (Optional) Custom web fonts
│       └── Poppins-Regular.ttf
│
├── data/                         # (Optional) JSON or text data
│   └── movies.json
│
├── includes/                     # (Optional) Common components
│   ├── header.html               # Navigation bar (import into all pages)
│   └── footer.html               # Footer (import into all pages)
│
├── docs/                         # Project documentation/report
│   ├── Project_Report.pdf
│   └── Screenshots/
│       ├── homepage.png
│       └── ratings-page.png
│
└── README.md                     # Project overview for submission or GitHub
