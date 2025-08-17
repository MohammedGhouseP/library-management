const express = require('express');
const MyBook = require('../models/MyBook');
const { authenticateUser } = require('../middleware/authenticateUser');

const router = express.Router();

// Get user's books (protected route)
router.get('/', authenticateUser, async (req, res) => {
  try {
    const myBooks = await MyBook.find({ userId: req.user._id })
      .populate('bookId')
      .sort({ dateAdded: -1 });

    res.json({
      success: true,
      books: myBooks,
      count: myBooks.length
    });

  } catch (error) {
    console.error('Get my books error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your books'
    });
  }
});

// Add book to user's collection
router.post('/:bookId', authenticateUser, async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    // Check if book already exists in user's collection
    const existingBook = await MyBook.findOne({ userId, bookId });
    
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book already in your library'
      });
    }

    // Add book to user's collection
    const myBook = new MyBook({
      userId,
      bookId,
      status: 'Want to Read'
    });

    await myBook.save();
    await myBook.populate('bookId');

    res.status(201).json({
      success: true,
      message: 'Book added to your library',
      book: myBook
    });

  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding book to library'
    });
  }
});

// Update book status
router.patch('/:bookId/status', authenticateUser, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    // Validate status
    const validStatuses = ['Want to Read', 'Currently Reading', 'Read'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Update book status
    const myBook = await MyBook.findOneAndUpdate(
      { userId, bookId },
      { 
        status,
        dateFinished: status === 'Read' ? new Date() : null
      },
      { new: true }
    ).populate('bookId');

    if (!myBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found in your library'
      });
    }

    res.json({
      success: true,
      message: 'Book status updated',
      book: myBook
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating book status'
    });
  }
});

// Update book rating
router.patch('/:bookId/rating', authenticateUser, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating } = req.body;
    const userId = req.user._id;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Update book rating
    const myBook = await MyBook.findOneAndUpdate(
      { userId, bookId },
      { rating },
      { new: true }
    ).populate('bookId');

    if (!myBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found in your library'
      });
    }

    res.json({
      success: true,
      message: 'Book rating updated',
      book: myBook
    });

  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating book rating'
    });
  }
});

module.exports = router;
