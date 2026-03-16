const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Plan = require('../models/Plan');
const Video = require('../models/Video');
const Subscription = require('../models/Subscription');
const Coupon = require('../models/Coupon');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Plan.deleteMany({});
    await Video.deleteMany({});
    await Subscription.deleteMany({});
    await Coupon.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // ==================== CREATE USERS ====================
    console.log('\n👥 Creating users...');

    const adminPassword = 'admin123';
    const userPassword = 'user123';

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log('✅ Admin created:', admin.email);

    // Create base user
    const regularUser = await User.create({
      name: 'Stream Citizen',
      email: 'user@example.com',
      password: userPassword,
      role: 'user'
    });
    console.log('✅ Base user created:', regularUser.email);

    // ==================== CREATE PLANS ====================
    console.log('\n📋 Creating subscription plans...');

    const plans = await Plan.create([
      {
        name: 'Basic',
        description: 'Perfect for getting started with standard cinematic library',
        price: 499,
        duration: 'monthly',
        features: [
          'Access to 50+ basic productions',
          'Standard HD (720p)',
          'Watch on 1 device',
          'Ad-supported experience'
        ],
        isActive: true
      },
      {
        name: 'Premium',
        description: 'The preferred choice for immersive entertainment',
        price: 999,
        duration: 'monthly',
        features: [
          'All Basic content + Premium Masterpieces',
          'Full HD (1080p)',
          'Watch on 3 devices simultaneously',
          'No advertisement interruptions',
          'Offline viewing capability'
        ],
        isActive: true
      },
      {
        name: 'Pro',
        description: 'Unlimited access to the entire StreamHub universe',
        price: 1499,
        duration: 'monthly',
        features: [
          'Total catalog access (unlimited)',
          'Ultra HD 4K + High Dynamic Range (HDR)',
          'Unlimited device concurrency',
          'Early access to weekly premieres',
          'Pro-Exclusive behind the scenes'
        ],
        isActive: true
      }
    ]);

    console.log('✅ Plans created');

    // ==================== CREATE COUPONS ====================
    console.log('\n🎟️ Creating promo campaigns...');
    await Coupon.create({
      code: 'ELITE25',
      discountPercentage: 25,
      expiryDate: new Date('2030-01-01'),
      usageLimit: 1000
    });
    console.log('✅ Campaign ELITE25 (25% OFF) established');

    // ==================== CREATE VIDEOS ====================
    console.log('\n🎬 Expanding video library (Netflix/Prime style)...');

    const videoAssets = [
      {
        title: "The Midnight Protocol",
        description: "In a world of constant surveillance, one hacker discovers the ultimate truth hidden in the static.",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: 3600,
        category: "Movies",
        accessTier: "basic",
        isTrending: true,
        isPremiere: true,
        releaseYear: 2026
      },
      {
        title: "Nebula Rising",
        description: "Experience the birth of a star system in stunning detail, captured by the latest deep-space arrays.",
        thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        duration: 5400,
        category: "Documentaries",
        accessTier: "premium",
        isTrending: true,
        isPremiere: true,
        releaseYear: 2025
      },
      {
        title: "Ghost in the Machine",
        description: "An AI begins to experience dreams that aren't its own, leading to a global existential crisis.",
        thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        duration: 7200,
        category: "TV Shows",
        accessTier: "pro",
        isTrending: true,
        isPremiere: true,
        releaseYear: 2026
      },
      {
        title: "Iron Core: Extraction",
        description: "The elite squad must recover a lost planetary core before the system collapses into chaos.",
        thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        duration: 6800,
        category: "Movies",
        accessTier: "pro",
        isTrending: false,
        isPremiere: false,
        releaseYear: 2024
      },
      {
        title: "Velocity One",
        description: "The world's fastest racing league faces a new threat: an undetectable ghost driver.",
        thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback.mp4",
        duration: 4500,
        category: "Movies",
        accessTier: "premium",
        isTrending: true,
        isPremiere: false,
        releaseYear: 2024
      },
      {
        title: "Cyber Nature",
        description: "How flora and fauna adapt to a world increasingly integrated with artificial environments.",
        thumbnail: "https://images.unsplash.com/photo-1547039956-65123fc827c1?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        duration: 3200,
        category: "Documentaries",
        accessTier: "basic",
        isTrending: false,
        isPremiere: false,
        releaseYear: 2023
      },
      {
        title: "The Architecture of Sound",
        description: "Exploring how urban environments are designed around the science of acoustics.",
        thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        duration: 2100,
        category: "Documentaries",
        accessTier: "pro",
        isTrending: false,
        isPremiere: true,
        releaseYear: 2025
      },
      {
        title: "City in the Clouds",
        description: "Exploring the floating metropolises of the 22nd century.",
        thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: 1800,
        category: "TV Shows",
        accessTier: "basic",
        isTrending: true,
        isPremiere: false,
        releaseYear: 2022
      },
      {
        title: "The Silent Forest",
        description: "A thriller about a forest that doesn't make a sound, and the hiker who gets lost in it.",
        thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        duration: 5900,
        category: "Movies",
        accessTier: "premium",
        isTrending: false,
        isPremiere: true,
        releaseYear: 2025
      },
      {
        title: "Ocean Wonders",
        description: "Dive deep into the bioluminescent world of the Pacific Trench.",
        thumbnail: "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: 4800,
        category: "Documentaries",
        accessTier: "basic",
        isTrending: true,
        isPremiere: false,
        releaseYear: 2024
      },
      {
        title: "Tokyo 2099",
        description: "A neon-soaked journey through the largest megacity on Earth.",
        thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        duration: 3600,
        category: "TV Shows",
        accessTier: "premium",
        isTrending: true,
        isPremiere: true,
        releaseYear: 2026
      },
      {
        title: "The Solar Sails",
        description: "Following the first manned mission to Proxima Centauri using light-sail technology.",
        thumbnail: "https://images.unsplash.com/photo-1446776899648-aa78eefe8521?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: 8200,
        category: "Movies",
        accessTier: "pro",
        isTrending: true,
        isPremiere: false,
        releaseYear: 2025
      },
      {
        title: "Cyber Odyssey",
        description: "A neon-noir journey through the neural pathways of a rogue city-mind.",
        thumbnail: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: 630,
        category: "Movies",
        accessTier: "pro",
        isTrending: true,
        isPremiere: true,
        releaseYear: 2026
      },
      {
        title: "The Neon Dream",
        description: "Visual poetry captured in the heart of a digital metropolis.",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        duration: 653,
        category: "Documentaries",
        accessTier: "premium",
        isTrending: true,
        isPremiere: false,
        releaseYear: 2026
      },
      {
        title: "Beyond the Horizon",
        description: "The first cinematic masterpiece filmed entirely at the edge of the atmosphere.",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        duration: 888,
        category: "TV Shows",
        accessTier: "pro",
        isTrending: false,
        isPremiere: true,
        releaseYear: 2026
      }
    ];

    // Multiply assets for a really full library (Total: 48 assets)
    const finalLibrary = [];
    const categories = ['Movies', 'TV Shows', 'Documentaries', 'Kids', 'Sports'];
    const tiers = ['basic', 'premium', 'pro'];

    for (let i = 0; i < 48; i++) {
      const template = videoAssets[i % videoAssets.length];
      finalLibrary.push({
        ...template,
        title: `${template.title} ${Math.floor(i / videoAssets.length) > 0 ? `Vol ${Math.floor(i / videoAssets.length) + 1}` : ''}`,
        category: categories[i % categories.length],
        accessTier: tiers[i % tiers.length],
        isTrending: i % 3 === 0,
        isPremiere: i % 4 === 0,
        views: Math.floor(Math.random() * 100000)
      });
    }

    await Video.create(finalLibrary);
    console.log(`✅ Created ${finalLibrary.length} cinematic assets`);

    console.log('\n🚀 SEEDING MISSION COMPLETE');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding mission failed:', error);
    process.exit(1);
  }
};

seedDatabase();