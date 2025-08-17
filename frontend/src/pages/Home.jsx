import React, { useEffect } from 'react';
import { useBooks } from '../context/BooksContext';
import BookCard from '../components/BookCard';

const Home = () => {
  const { allBooks, loading, error, fetchAllBooks } = useBooks();

  useEffect(() => {
    fetchAllBooks();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading books...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4>Error Loading Books</h4>
          <p>{error}</p>
          <button 
            className="btn btn-outline-danger"
            onClick={fetchAllBooks}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          <h2 className="mb-4">📚 Discover Books</h2>
          
          {allBooks.length === 0 ? (
            <div className="alert alert-info">
              <h4>No Books Available</h4>
              <p>Check back later for new books!</p>
            </div>
          ) : (
            <>
              <p className="text-muted mb-4">
                Found {allBooks.length} books. Click "Want to Read" to add them to your library!
              </p>
              
              <div className="row">
                {allBooks.map(book => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
