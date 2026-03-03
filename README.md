# MovieHub — Project Documentation

## CHAPTER 1: INTRODUCTION

### 1.1 Introduction
MovieHub is a modern, high-performance web application designed for movie enthusiasts to discover, track, and interact with the latest films and TV shows. Built with visual excellence and user experience in mind, it leverages the TMDB API to provide real-time data, trailers, and rich media content.

### 1.2 Background of the Project
With the explosion of digital content, users often find it difficult to keep track of what to watch. MovieHub addresses this by providing a unified interface for discovery and personal watchlist management.

### 1.3 Problem Definition
*   Difficulty in finding centralized, visually appealing movie data.
*   Lack of personalized tracking features on many free platforms.
*   Fragmented experience between trailers, ratings, and cast information.

### 1.4 Goals of the Project
*   Provide a stunning, premium UI/UX for movie discovery.
*   Enable seamless transitions between dark and light themes.
*   Implement a robust system for tracking personal watchlists and ratings.

### 1.5 Objectives
*   Develop a responsive, mobile-first web interface.
*   Integrate TMDB API for accurate and detailed content.
*   Implement authentication and authorization for personalized features.
*   Ensure high performance and smooth animations.

### 1.6 Scope of the Project
The project covers the frontend development, API integration, and client-side state management for a complete cinema exploration experience.

### 1.7 Limitations
*   Data is limited to what is provided by TMDB.
*   Requires an active internet connection for real-time data.
*   Currently a client-side implementation (static hosting).

### 1.8 Target Audience
*   Cinephiles and TV show bingers.
*   Casual viewers looking for recommendations.
*   Students and developers interested in modern web design.

### 1.9 Methodology
This project followed an **Iterative Development Methodology**, starting from wireframing and prototyping to incremental feature implementation (discovery, details, then authentication).

### 1.10 Tools and Technologies Used

#### 1.10.1 Frontend Technologies
*   **HTML5**: Semantic structure.
*   **Vanilla CSS**: Custom design system, glassmorphism, and animations.
*   **JavaScript (ES6+)**: Dynamic content rendering and API logic.
*   **TMDB API**: Global database for movies and TV.

#### 1.10.2 Design Tools
*   **Figma**: UI/UX design and wireframing.
*   **Canva**: Social media assets and branding.

#### 1.10.3 Development Tools
*   **VS Code**: Primary code editor.
*   **Git & GitHub**: Version control and hosting.
*   **Browser DevTools**: Performance tuning and debugging.

### 1.11 Report Organization
This report is organized into five main chapters, covering the planning, design, implementation, and future outlook of MovieHub.

### 1.12 Gantt Chart (Project Timeline)
*   **Week 1**: Research & Planning
*   **Week 2**: UI/UX Design & Wireframing
*   **Week 3**: Core Implementation (API Integration)
*   **Week 4**: Feature Enhancement & Testing
*   **Week 5**: Documentation & Final Polish

---

## CHAPTER 2: STORYBOARD AND MODELLING

### 2.1 Background Study / Literature Review
Analysis of existing platforms like IMDb, Letterboxd, and Netflix to identify user pain points and design trends (e.g., dark mode, card-based layouts).

### 2.2 Requirement Analysis

#### 2.2.1 Functional Requirements
*   Real-time movie/TV search.
*   Dynamic categorization (Trending, Top Rated, Genres).
*   Watchlist and Favorites management.
*   User Authentication system.
*   Trailer playback.

#### 2.2.2 Non-Functional Requirements
*   Performance (loading under 2s).
*   Responsiveness (works on Mobile, Tablet, Desktop).
*   High contrast and legibility in both themes.

### 2.3 System Architecture
[Client-Side Architecture Diagram]
MovieHub operates as a Single-Page (or multi-page static) Application interacting directly with the TMDB REST API. Data is cached in `localStorage` for personalization.

### 2.4 Wireframe Design
Wireframes were developed for:
1.  Home / Discovery
2.  Movies Listing
3.  Movie Details
4.  User Profile
5.  Watchlist

### 2.5 Navigation Structure
[Navigation Diagram]
Index -> Movies / TV Shows / Watchlist / Contact -> Details -> Actor Profiles.

### 2.6 UI/UX Design Decisions

#### 2.6.1 Color Selection
*   **Primary**: Netflix Red (#e50914)
*   **Dark Theme**: Rich Obsidian (#0a0a0f)
*   **Light Theme**: Soft Grey (#f5f5f7)

#### 2.6.2 Typography
*   **Font**: Inter (Modern sans-serif)
*   **Sizes**: 14px (Secondary) to 72px (Hero Titles)

#### 2.6.3 Layout Structure
Modular card-based grid with horizontal scrolling for "Trending" sections to maximize vertical real estate.

#### 2.6.4 Responsiveness Strategy
Flexbox and CSS Grid combined with media queries to ensure a seamless experience from 320px to 1440px widths.

---

## CHAPTER 3: SYSTEM IMPLEMENTATION & DISCUSSION

### 3.1 Website Structure
The site is divided into a clean directory structure: `/root`, `/pages`, `/css`, `/js`, and `/assets`.

### 3.2 Page and Section Overview
*   **Hero**: High-impact visual entrance.
*   **Discovery Grids**: Content-rich exploration areas.
*   **Details**: Deep-dive information hub.

### 3.3 Code Structure Explanation
Focuses on modular JavaScript files for maintainability (`api.js`, `main.js`, `home.js`).

### 3.4 Testing

#### 3.4.1 Browser Testing
Verified on Chrome, Edge, Safari, and Firefox.

#### 3.4.2 Responsiveness Testing
Tested using Chrome DevTools across various device footprints.

#### 3.4.3 Performance Testing
Optimized via image lazy-loading and efficient API calls.

### 3.5 Solving the Existing Problem
MovieHub provides a faster, more visually engaging experience than generic alternatives.

### 3.6 Challenges Faced
*   Handling complex API async chains.
*   Implementing smooth, performant animations across browsers.
*   Ensuring theme consistency in Light mode.

---

## CHAPTER 4: FUTURE ENHANCEMENTS

### 4.1 Future Enhancement Features
*   Social features (Follow friends, share watchlists).

### 4.2 Enhance Interactivity
Adding drag-and-drop to reorder watchlists.

### 4.3 Content Management Integration
Moving to a dedicated backend for user data persistence.

### 4.4 API Integration
Integrating JustWatch API for streaming availability.

### 4.5 Enhance Visual Design
Introducing 3D elements and immersive scrolling.

### 4.6 Security Enhancement
Implementing OAuth 2.0 (Google/GitHub login).

### 4.7 SEO Optimization
Server-Side Rendering (SSR) for better search indexing.

---

## CHAPTER 5: CONCLUSION

### 5.1 Summary of Work
Successfully built a production-ready movie discovery platform with advanced UI features.

### 5.2 Achievements
*   Completed 12+ dynamic pages.
*   Fully functional theme engine.
*   Seamless TMDB integration.

### 5.3 Final Remarks
MovieHub showcases the power of modern web technologies to create premium entertainment experiences.

---

## REFERENCES
*   TMDB API Documentation
*   MDN Web Docs
*   Google Fonts (Inter)
*   BoxIcons

---

## APPENDICES
### Appendix A: Source Code
Available at: [GitHub Repository Link]
### Appendix B: Screenshots
[Landing Page], [Details View], [Mobile View]
### Appendix C: Gantt Chart
[Visual Timeline]
### Appendix D: Workload Matrix
*   **Team Member Roles**: Bijay Budha (Lead Developer & Designer)
*   **Task Distribution**: 100% Development, 100% Design, 100% Documentation.
*   **Contribution Percentage**: 100%
