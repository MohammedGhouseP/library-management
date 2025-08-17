import React, { useEffect } from 'react';
import { useBooks } from '../context/BooksContext';
import MyBookCard from '../components/MyBookCard';

const MyBooks = () => {
  const { myBooks, myBooksLoading, error, fetchMyBooks } = useBooks();

  useEffect(() => {
    fetchMyBooks();
  }, []);

  if (myBooksLoading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading your books...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4>Error Loading Your Books</h4>
          <p>{error}</p>
          <button 
            className="btn btn-outline-danger"
            onClick={fetchMyBooks}
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
          <h2 className="mb-4">📖 My Books</h2>
          
          {myBooks.length === 0 ? (
            <div className="alert alert-info">
              <h4>Your Library is Empty</h4>
              <p>Start building your library by adding books from the home page!</p>
              <a href="/" className="btn btn-primary">Browse Books</a>
            </div>
          ) : (
            <>
              <p className="text-muted mb-4">
                You have {myBooks.length} books in your library.
              </p>
              
              {/* Statistics */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5 className="card-title text-primary">
                        {myBooks.filter(book => book.status === 'Want to Read').length}
                      </h5>
                      <small className="text-muted">Want to Read</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5 className="card-title text-warning">
                        {myBooks.filter(book => book.status === 'Currently Reading').length}
                      </h5>
                      <small className="text-muted">Currently Reading</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5 className="card-title text-success">
                        {myBooks.filter(book => book.status === 'Read').length}
                      </h5>
                      <small className="text-muted">Read</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                {myBooks.map(myBook => (
                  <MyBookCard key={myBook._id} myBook={myBook} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
