import React, { useState } from 'react';
import { useBooks } from '../context/BooksContext';

const MyBookCard = ({ myBook }) => {
  const { updateBookStatus, updateBookRating } = useBooks();
  const [isUpdating, setIsUpdating] = useState(false);

  const book = myBook.bookId; // The populated book data

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    const result = await updateBookStatus(book._id, newStatus);
    
    if (result.success) {
      console.log(result.message);
    } else {
      alert(result.error);
    }
    
    setIsUpdating(false);
  };

  const handleRatingChange = async (rating) => {
    setIsUpdating(true);
    const result = await updateBookRating(book._id, parseInt(rating));
    
    if (result.success) {
      console.log(result.message);
    } else {
      alert(result.error);
    }
    
    setIsUpdating(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-warning' : 'text-muted'}>
          ⭐
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100">
        <img 
          src={book.coverImage} 
          className="card-img-top" 
          alt={book.title}
          style={{ height: '250px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h6 className="card-title">{book.title}</h6>
          <p className="card-text text-muted small">by {book.author}</p>
          
          {/* Status */}
          <div className="mb-3">
            <label className="form-label small">Status:</label>
            <select 
              className="form-select form-select-sm"
              value={myBook.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
            >
              <option value="Want to Read">Want to Read</option>
              <option value="Currently Reading">Currently Reading</option>
              <option value="Read">Read</option>
            </select>
          </div>

          {/* Rating */}
          <div className="mb-3">
            <label className="form-label small">Rating:</label>
            <div className="d-flex align-items-center">
              <select 
                className="form-select form-select-sm me-2"
                value={myBook.rating || ''}
                onChange={(e) => e.target.value && handleRatingChange(e.target.value)}
                disabled={isUpdating}
              >
                <option value="">No Rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
              <div>
                {myBook.rating ? renderStars(myBook.rating) : 'No rating'}
              </div>
            </div>
          </div>

          {/* Date Added */}
          <small className="text-muted mt-auto">
            Added: {new Date(myBook.dateAdded).toLocaleDateString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default MyBookCard;
