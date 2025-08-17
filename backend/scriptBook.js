const mongoose = require('mongoose');
const Book = require('../models/Book');

const sampleBooks = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    genre: "Fiction",
    publishedYear: 1960,
    isbn: "978-0-06-112008-4",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel about totalitarian control.",
    genre: "Science Fiction",
    publishedYear: 1949,
    isbn: "978-0-452-28423-4",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71rpa1-kyvL.jpg"
  }
  // Add more sample books as needed
];

const seedBooks = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/books-library');
    await Book.deleteMany({});
    await Book.insertMany(sampleBooks);
    console.log('✅ Sample books added successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    process.exit(1);
  }
};

seedBooks();
