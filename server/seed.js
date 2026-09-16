// seed.js - Database Seeder Script for Sample Data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Book = require('./models/Book');
const Loan = require('./models/Loan');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library_portal';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB for seeding: ${mongoUri}`);

    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    await Loan.deleteMany();
    await Notification.deleteMany();
    console.log('Cleared existing collections...');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const librarianPassword = await bcrypt.hash('librarian123', salt);
    const memberPassword = await bcrypt.hash('member123', salt);

    // 1. Create Users
    const users = await User.insertMany([
      {
        name: 'System Admin',
        email: 'admin@library.com',
        password: adminPassword,
        role: 'Admin',
        phone: '+1 (555) 019-2831',
        address: 'Administrative HQ, Suite 400',
        membershipStatus: 'Active',
      },
      {
        name: 'Eleanor Vance',
        email: 'librarian@library.com',
        password: librarianPassword,
        role: 'Librarian',
        phone: '+1 (555) 014-9922',
        address: 'Library Main Desk, Floor 1',
        membershipStatus: 'Active',
      },
      {
        name: 'Alex Turner',
        email: 'member@library.com',
        password: memberPassword,
        role: 'Member',
        memberCode: 'LIB-M0001',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace',
        membershipStatus: 'Active',
      },
      {
        name: 'Sarah Connor',
        email: 'sarah@library.com',
        password: memberPassword,
        role: 'Member',
        memberCode: 'LIB-M0002',
        phone: '+1 (555) 987-6543',
        address: '101 Cyberdyne Way',
        membershipStatus: 'Active',
      },
    ]);

    const adminUser = users[0];
    const librarianUser = users[1];
    const alexMember = users[2];
    const sarahMember = users[3];

    console.log('Users seeded successfully.');

    // 2. Create Books
    const books = await Book.insertMany([
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        category: 'Computer Science',
        totalCopies: 5,
        availableCopies: 4, // 1 borrowed
        publisher: 'Prentice Hall',
        publishedYear: 2008,
        description:
          'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. This book teaches software craftmanship and best practices.',
        coverImage:
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        isbn: '978-1449373320',
        category: 'Computer Science',
        totalCopies: 4,
        availableCopies: 3, // 1 borrowed
        publisher: "O'Reilly Media",
        publishedYear: 2017,
        description:
          'The definitive guide to the architecture of data systems, covering distributed storage, transactions, stream processing, and scalability.',
        coverImage:
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Eloquent JavaScript: A Modern Introduction',
        author: 'Marijn Haverbeke',
        isbn: '978-1593279509',
        category: 'Computer Science',
        totalCopies: 6,
        availableCopies: 6,
        publisher: 'No Starch Press',
        publishedYear: 2018,
        description:
          'A thorough and beautiful introduction to JavaScript programming, from basics and DOM manipulation to Node.js backend concepts.',
        coverImage:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0451524935',
        category: 'Literature & Fiction',
        totalCopies: 4,
        availableCopies: 3, // 1 borrowed
        publisher: 'Signet Classic',
        publishedYear: 1949,
        description:
          'A dystopian masterpiece focusing on surveillance, state power, truth distortion, and the resilient human spirit in totalitarian Oceania.',
        coverImage:
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0060935467',
        category: 'Literature & Fiction',
        totalCopies: 3,
        availableCopies: 3,
        publisher: 'Harper Perennial',
        publishedYear: 1960,
        description:
          'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, exploring compassion and justice.',
        coverImage:
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0743273565',
        category: 'Literature & Fiction',
        totalCopies: 5,
        availableCopies: 5,
        publisher: 'Scribner',
        publishedYear: 1925,
        description:
          'The exemplary novel of the Jazz Age, capturing the American dream, illusions of romance, and glamour in 1920s Long Island.',
        coverImage:
          'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '978-0062316097',
        category: 'Science & History',
        totalCopies: 4,
        availableCopies: 4,
        publisher: 'Harper',
        publishedYear: 2015,
        description:
          'A groundbreaking exploration of how biology and history have defined us and enhanced our understanding of what it means to be human.',
        coverImage:
          'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '978-0553380163',
        category: 'Science & History',
        totalCopies: 3,
        availableCopies: 3,
        publisher: 'Bantam',
        publishedYear: 1988,
        description:
          'A landmark volume in science writing by one of the greatest minds of our time, exploring black holes, time travel, and the origins of the cosmos.',
        coverImage:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
        author: 'James Clear',
        isbn: '978-0735211292',
        category: 'Self Help & Business',
        totalCopies: 7,
        availableCopies: 7,
        publisher: 'Avery',
        publishedYear: 2018,
        description:
          'No matter your goals, Atomic Habits offers a proven framework for improving every day with small changes that lead to remarkable results.',
        coverImage:
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        isbn: '978-0857197689',
        category: 'Self Help & Business',
        totalCopies: 4,
        availableCopies: 4,
        publisher: 'Harriman House',
        publishedYear: 2020,
        description:
          'Timeless lessons on wealth, greed, and happiness doing well with money isn’t necessarily about what you know. It’s about how you behave.',
        coverImage:
          'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&auto=format&fit=crop&q=80',
      },
    ]);

    console.log(`Seeded ${books.length} books successfully.`);

    // 3. Create sample Loans
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const fourDaysInFuture = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

    // Active loan (due in 4 days)
    await Loan.create({
      book: books[0]._id, // Clean Code
      member: alexMember._id,
      issueDate: tenDaysAgo,
      dueDate: fourDaysInFuture,
      status: 'borrowed',
      notes: 'Issued at desk 1',
    });

    // Overdue loan (was due 6 days ago)
    await Loan.create({
      book: books[1]._id, // Designing Data-Intensive Applications
      member: sarahMember._id,
      issueDate: twentyDaysAgo,
      dueDate: sixDaysAgo,
      status: 'overdue',
      notes: 'Overdue reminder notice dispatched',
    });

    // Returned loan
    await Loan.create({
      book: books[3]._id, // 1984
      member: alexMember._id,
      issueDate: twentyDaysAgo,
      dueDate: sixDaysAgo,
      returnDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'returned',
      fineAmount: 0,
      notes: 'Returned in pristine condition',
    });

    console.log('Seeded sample loans successfully.');

    // 4. Create Notifications for member
    await Notification.insertMany([
      {
        user: alexMember._id,
        title: 'Welcome to Library Portal!',
        message: 'Your member account is active. Browse books and manage your loans easily.',
        type: 'success',
      },
      {
        user: alexMember._id,
        title: 'Upcoming Book Due Date',
        message: 'Clean Code is due in 4 days. Remember to return or renew in time.',
        type: 'warning',
      },
      {
        user: sarahMember._id,
        title: 'Overdue Notice',
        message: 'Designing Data-Intensive Applications is past its due date. Please return it as soon as possible.',
        type: 'danger',
      },
    ]);

    console.log('Seeded notifications successfully.');
    console.log('\n--- Seed Completed Successfully! ---');
    console.log('Demo Credentials:');
    console.log('Admin:     admin@library.com     / admin123');
    console.log('Librarian: librarian@library.com / librarian123');
    console.log('Member:    member@library.com    / member123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
