# Full-Stack Library Management Project

## Project Overview

This project is a Full-Stack Library Management System developed as part of the Capstone project for the Patika+ Frontend Web Developer Program. The application enables users to manage various entities within a library, including publishers, categories, books, and authors. The frontend is built using React with Material-UI, while the backend is powered by Spring Boot and uses PostgreSQL as the database.

## Features

- **Single Page Application**: Built using React Router to allow seamless navigation between different pages.
- **CRUD Operations**: Users can perform Create, Read, Update, and Delete operations for Publishers, Categories, Books, Authors, and Book Borrowings.
- **User Notifications**: Inform users of operation failures using modals instead of window alerts.
- **Responsive Design**: The application is designed to be user-friendly and visually appealing.
- **Error Handling**: Displays error messages when attempting to borrow or return books for a date that is either in the future or before the borrowing date, utilizing the error modal feature to enhance user experience.


## Technologies Used

- **Frontend**: 
  - React
  - React Router
  - Material-UI (MUI) for styling and components
  - CSS
  - HTML
  
- **Backend**: 
  - Spring Boot
  - PostgreSQL

## How to Run the Project

### Prerequisites

- Java (JDK 11 or higher for the backend)
- PostgreSQL

### Setting Up the Backend

1. Clone the repository:
 ```
   bash
   git clone <repository-url>
   cd backend

./mvnw spring-boot:run
 ```

### Gifs
- **Author Management**: Add, update, and delete authors in the system.
![Author Management](./gifs/Author%20Gif.gif)

- **Category Management**: Manage book categories with ease.
![Category Management](./gifs/Category%20Gif.gif)

- **Book Management**: Perform CRUD operations on books.
![Book Management](./gifs/book_gif.gif)

- **Borrowing Management**: Keep track of borrowed books.
![Borrowing Management](./gifs/borrow_gif.gif)

### Video Walkthrough
Watch the full video demonstration on YouTube:

[Library Full-Stack Project Walkthrough](https://www.youtube.com/watch?v=pVPOulJausE)

# **LIVE LINK** 🔴

## 🔗 [👉 YOU CAN ACCESS THE LIVE LINK!](https://library-full-stack-project.vercel.app/)


### Code Snippets

#### Main Entry Point
 ```
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>    
);
 ```


#### App Component
 ```
function App() {
  const [homePage, setHomePage] = useState(true);

  return (
    <>
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<Book />} />
          <Route path="/book-borrowing" element={<BookBorrowing />} />
          <Route path="/publisher" element={<Publisher />} />
          <Route path="/author" element={<Author />} />
          <Route path="/category" element={<Category />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
 ```

#### Home Page Component
 ```
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate('/book');
    }

    return (
        <>
            <div className='home-container'>
                <div className='content-container'>
                    <div className='home-heading'>
                        <h2>LIBRARY</h2>
                        <h2>MANAGEMENT SYSTEM</h2>
                    </div>
                    <br />
                    <div className='home-page-button'>
                        <button onClick={handleClick}>Welcome Padawan!</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
 ```


### Conclusion
This project demonstrates the ability to integrate a frontend built with React and Material-UI with a backend powered by Spring Boot and PostgreSQL, allowing for efficient library management. The focus on user experience through modals and seamless navigation enhances the overall functionality of the application.



 ``` Feel free to modify or add to this as you see fit!  ```

