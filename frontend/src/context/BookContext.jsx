import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const BooksContext = createContext();

// Books action types
const BOOKS_ACTIONS = {
  FETCH_BOOKS_START: 'FETCH_BOOKS_START',
  FETCH_BOOKS_SUCCESS: 'FETCH_BOOKS_SUCCESS',
  FETCH_BOOKS_FAIL: 'FETCH_BOOKS_FAIL',
  FETCH_MY_BOOKS_START: 'FETCH_MY_BOOKS_START',
  FETCH_MY_BOOKS_SUCCESS: 'FETCH_MY_BOOKS_SUCCESS',
  FETCH_MY_BOOKS_FAIL: 'FETCH_MY_BOOKS_FAIL',
  ADD_BOOK_SUCCESS: 'ADD_BOOK_SUCCESS',
  UPDATE_BOOK_SUCCESS: 'UPDATE_BOOK_SUCCESS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  allBooks: [],
  myBooks: [],
  loading: false,
  myBooksLoading: false,
  error: null
};

// Books reducer
const booksReducer = (state, action) => {
  switch (action.type) {
    case BOOKS_ACTIONS.FETCH_BOOKS_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case BOOKS_ACTIONS.FETCH_BOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        allBooks: action.payload,
        error: null
      };
    
    case BOOKS_ACTIONS.FETCH_BOOKS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case BOOKS_ACTIONS.FETCH_MY_BOOKS_START:
      return {
        ...state,
        myBooksLoading: true,
        error: null
      };
    
    case BOOKS_ACTIONS.FETCH_MY_BOOKS_SUCCESS:
      return {
        ...state,
        myBooksLoading: false,
        myBooks: action.payload,
        error: null
      };
    
    case BOOKS_ACTIONS.FETCH_MY_BOOKS_FAIL:
      return {
        ...state,
        myBooksLoading: false,
        error: action.payload
      };
    
    case BOOKS_ACTIONS.ADD_BOOK_SUCCESS:
      return {
        ...state,
        myBooks: [action.payload, ...state.myBooks]
      };
    
    case BOOKS_ACTIONS.UPDATE_BOOK_SUCCESS:
      return {
        ...state,
        myBooks: state.myBooks.map(book => 
          book._id === action.payload._id ? action.payload : book
        )
      };
    
    case BOOKS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case BOOKS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Books Provider Component
export const BooksProvider = ({ children }) => {
  const [state, dispatch] = useReducer(booksReducer, initialState);

  const fetchAllBooks = async () => {
    try {
      dispatch({ type: BOOKS_ACTIONS.FETCH_BOOKS_START });
      
      const response = await axios.get('/books');
      
      if (response.data.success) {
        dispatch({
          type: BOOKS_ACTIONS.FETCH_BOOKS_SUCCESS,
          payload: response.data.books
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch books';
      dispatch({
        type: BOOKS_ACTIONS.FETCH_BOOKS_FAIL,
        payload: errorMessage
      });
    }
  };

  const fetchMyBooks = async () => {
    try {
      dispatch({ type: BOOKS_ACTIONS.FETCH_MY_BOOKS_START });
      
      const response = await axios.get('/mybooks');
      
      if (response.data.success) {
        dispatch({
          type: BOOKS_ACTIONS.FETCH_MY_BOOKS_SUCCESS,
          payload: response.data.books
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch your books';
      dispatch({
        type: BOOKS_ACTIONS.FETCH_MY_BOOKS_FAIL,
        payload: errorMessage
      });
    }
  };

  const addBookToLibrary = async (bookId) => {
    try {
      const response = await axios.post(`/mybooks/${bookId}`);
      
      if (response.data.success) {
        dispatch({
          type: BOOKS_ACTIONS.ADD_BOOK_SUCCESS,
          payload: response.data.book
        });
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add book';
      dispatch({
        type: BOOKS_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const updateBookStatus = async (bookId, status) => {
    try {
      const response = await axios.patch(`/mybooks/${bookId}/status`, { status });
      
      if (response.data.success) {
        dispatch({
          type: BOOKS_ACTIONS.UPDATE_BOOK_SUCCESS,
          payload: response.data.book
        });
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      dispatch({
        type: BOOKS_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const updateBookRating = async (bookId, rating) => {
    try {
      const response = await axios.patch(`/mybooks/${bookId}/rating`, { rating });
      
      if (response.data.success) {
        dispatch({
          type: BOOKS_ACTIONS.UPDATE_BOOK_SUCCESS,
          payload: response.data.book
        });
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update rating';
      dispatch({
        type: BOOKS_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    dispatch({ type: BOOKS_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    fetchAllBooks,
    fetchMyBooks,
    addBookToLibrary,
    updateBookStatus,
    updateBookRating,
    clearError
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
};

// Custom hook to use books context
export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};
