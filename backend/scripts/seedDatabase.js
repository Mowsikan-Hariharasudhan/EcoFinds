const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecofinds', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📝 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Sample data
const categories = [
  {
    name: 'Clothing & Fashion',
    description: 'Sustainable and eco-friendly clothing items',
    slug: 'clothing-fashion',
    icon: 'Package',
    color: '#6B7B5A',
    isActive: true
  },
  {
    name: 'Electronics',
    description: 'Refurbished and energy-efficient electronics',
    slug: 'electronics',
    icon: 'Package',
    color: '#6B7B5A',
    isActive: true
  },
  {
    name: 'Home & Garden',
    description: 'Eco-friendly home and garden products',
    slug: 'home-garden',
    icon: 'Package',
    color: '#6B7B5A',
    isActive: true
  },
  {
    name: 'Books & Media',
    description: 'Second-hand books, CDs, and media',
    slug: 'books-media',
    icon: 'Package',
    color: '#6B7B5A',
    isActive: true
  },
  {
    name: 'Sports & Recreation',
    description: 'Pre-owned sports equipment and outdoor gear',
    slug: 'sports-recreation',
    icon: 'Package',
    color: '#6B7B5A',
    isActive: true
  }
];

const sampleUsers = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    accountType: 'business',
    avatar: 'https://res.cloudinary.com/demo/image/upload/v1234567890/avatar1.jpg',
    business: {
      name: 'EcoStyle Boutique',
      description: 'Sustainable fashion for the modern conscious consumer',
      website: 'https://ecostyle.com',
      verified: true,
      rating: 4.8,
      totalSales: 150
    },
    isActive: true
  },
  {
    email: 'sarah.green@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Green',
    accountType: 'business',
    avatar: 'https://res.cloudinary.com/demo/image/upload/v1234567890/avatar2.jpg',
    business: {
      name: 'Green Electronics',
      description: 'Refurbished electronics with warranty',
      website: 'https://greenelectronics.com',
      verified: true,
      rating: 4.9,
      totalSales: 89
    },
    isActive: true
  },
  {
    email: 'mike.miller@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Miller',
    accountType: 'individual',
    avatar: 'https://res.cloudinary.com/demo/image/upload/v1234567890/avatar3.jpg',
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Wait for connection to be ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    // Clear existing data more thoroughly
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    for (const name of collectionNames) {
      if (['users', 'categories', 'products', 'carts', 'orders', 'reviews', 'messages', 'conversations'].includes(name)) {
        await mongoose.connection.db.collection(name).drop().catch(() => {
          // Collection might not exist, that's fine
        });
      }
    }

    console.log('🗑️  Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('📂 Created categories:', createdCategories.length);

    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log('👥 Created users:', createdUsers.length);

    // Create sample products
    const sampleProducts = [
      {
        title: 'Organic Cotton T-Shirt',
        description: 'Made from 100% organic cotton, this t-shirt is perfect for everyday wear. Soft, comfortable, and sustainably produced.',
        price: 25.99,
        category: createdCategories[0]._id, // Clothing
        seller: createdUsers[0]._id, // John Doe
        condition: 'new',
        quantity: 50,
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt1.jpg',
            alt: 'Organic Cotton T-Shirt Front View'
          },
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt2.jpg',
            alt: 'Organic Cotton T-Shirt Back View'
          }
        ],
        tags: ['organic', 'cotton', 'sustainable', 'clothing'],
        sustainability: {
          ecoScore: 9,
          carbonFootprint: 1.2,
          materials: ['100% Organic Cotton'],
          certifications: ['GOTS Certified', 'Fair Trade']
        },
        location: {
          city: 'Portland',
          state: 'Oregon',
          country: 'USA'
        },
        status: 'active',
        featured: true
      },
      {
        title: 'Refurbished iPhone 12',
        description: 'Fully tested and refurbished iPhone 12 in excellent condition. Comes with 1-year warranty.',
        price: 499.99,
        category: createdCategories[1]._id, // Electronics
        seller: createdUsers[1]._id, // Sarah Green
        condition: 'like-new',
        quantity: 5,
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/iphone1.jpg',
            alt: 'Refurbished iPhone 12'
          }
        ],
        tags: ['iphone', 'smartphone', 'refurbished', 'apple'],
        sustainability: {
          ecoScore: 8,
          carbonFootprint: 2.5,
          materials: ['Aluminum', 'Glass', 'Recycled Components'],
          certifications: ['Energy Star']
        },
        location: {
          city: 'San Francisco',
          state: 'California',
          country: 'USA'
        },
        status: 'active'
      },
      {
        title: 'Bamboo Kitchen Utensil Set',
        description: 'Complete set of kitchen utensils made from sustainable bamboo. Includes spatula, spoons, and tongs.',
        price: 15.99,
        category: createdCategories[2]._id, // Home & Garden
        seller: createdUsers[0]._id, // John Doe
        condition: 'new',
        quantity: 30,
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/bamboo1.jpg',
            alt: 'Bamboo Kitchen Utensil Set'
          }
        ],
        tags: ['bamboo', 'kitchen', 'utensils', 'sustainable'],
        sustainability: {
          ecoScore: 10,
          carbonFootprint: 0.3,
          materials: ['100% Bamboo'],
          certifications: ['FSC Certified']
        },
        location: {
          city: 'Seattle',
          state: 'Washington',
          country: 'USA'
        },
        status: 'active',
        featured: true
      },
      {
        title: 'Classic Literature Collection',
        description: 'Set of 10 classic literature books in good condition. Perfect for any book lover.',
        price: 35.00,
        category: createdCategories[3]._id, // Books & Media
        seller: createdUsers[2]._id, // Mike Miller
        condition: 'good',
        quantity: 1,
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/books1.jpg',
            alt: 'Classic Literature Collection'
          }
        ],
        tags: ['books', 'literature', 'classic', 'reading'],
        sustainability: {
          ecoScore: 9,
          carbonFootprint: 0.1,
          materials: ['Paper', 'Ink'],
          certifications: []
        },
        location: {
          city: 'Austin',
          state: 'Texas',
          country: 'USA'
        },
        status: 'active'
      },
      {
        title: 'Used Mountain Bike',
        description: 'Well-maintained mountain bike, perfect for trails and outdoor adventures. Recently serviced.',
        price: 299.99,
        category: createdCategories[4]._id, // Sports & Recreation
        seller: createdUsers[2]._id, // Mike Miller
        condition: 'good',
        quantity: 1,
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/bike1.jpg',
            alt: 'Used Mountain Bike'
          }
        ],
        tags: ['bicycle', 'mountain bike', 'sports', 'outdoor'],
        sustainability: {
          ecoScore: 8,
          carbonFootprint: 0.5,
          materials: ['Aluminum Frame', 'Steel Components'],
          certifications: []
        },
        location: {
          city: 'Denver',
          state: 'Colorado',
          country: 'USA'
        },
        status: 'active'
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log('🛍️  Created products:', createdProducts.length);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log('\n🔐 Test Login Credentials:');
    console.log('   Business User: john.doe@example.com / password123');
    console.log('   Business User: sarah.green@example.com / password123');
    console.log('   Individual User: mike.miller@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeder
(async () => {
  try {
    await connectDB();
    await seedDatabase();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
})();
