import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BooksContext';

const BookCard = ({ book }) => {
  const { isAuthenticated } = useAuth();
  const { addBookToLibrary } = useBooks();
  const [isAdding, setIsAdding] = useState(false);

  const handleWantToRead = async () => {
    if (!isAuthenticated) {
      alert('Please log in to add books to your library');
      return;
    }

    setIsAdding(true);
    const result = await addBookToLibrary(book._id);
    
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error);
    }
    
    setIsAdding(false);
  };

  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="card h-100">
        <img 
          src={book.coverImage} 
          className="card-img-top" 
          alt={book.title}
          style={{ height: '300px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h6 className="card-title">{book.title}</h6>
          <p className="card-text text-muted small">by {book.author}</p>
          <p className="card-text small flex-grow-1">{book.description}</p>
          
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">{book.genre}</small>
              <small className="text-muted">{book.publishedYear}</small>
            </div>
            
            <button 
              className="btn btn-primary btn-sm w-100"
              onClick={handleWantToRead}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Adding...
                </>
              ) : (
                'Want to Read'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
