const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('../models/User');
const Property = require('../models/Property');
const Place = require('../models/Place');
const Experience = require('../models/Experience');

const connectDB = require('./db');

const seed = async () => {
  await connectDB();
  
  // Clear all data
  await Promise.all([
    User.deleteMany(),
    Property.deleteMany(),
    Place.deleteMany(),
    Experience.deleteMany()
  ]);
  console.log('🗑  Cleared existing data');

  // Create users
  const adminPass = await bcrypt.hash('admin123', 12);
  const hostPass = await bcrypt.hash('host123', 12);
  const userPass = await bcrypt.hash('user123', 12);

  const [admin, host1, host2] = await User.insertMany([
    { name: 'Admin Tourista', email: 'admin@tourista.pk', password: adminPass, role: 'admin', isVerified: true },
    { name: 'Karim Shah', email: 'karim@host.pk', password: hostPass, role: 'host', isVerified: true, bio: 'Local host from Hunza with 10+ years experience in tourism.' },
    { name: 'Fatima Bibi', email: 'fatima@host.pk', password: hostPass, role: 'host', isVerified: true, bio: 'Skardu-based host offering authentic Balti hospitality.' },
    { name: 'Ali Hassan', email: 'ali@user.pk', password: userPass, role: 'user', isVerified: true }
  ]);

  console.log('✅ Users created');

  // Create places
  const places = await Place.insertMany([
    {
      name: 'Hunza Valley',
      description: 'One of the most beautiful valleys in the world, known for its dramatic mountain scenery, ancient forts, and warm hospitality. The valley is surrounded by towering peaks including Rakaposhi and Ultar Sar.',
      images: [{ url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800' }],
      location: { region: 'Hunza', address: 'Hunza Valley, Gilgit-Baltistan', latitude: 36.3167, longitude: 74.6500 },
      category: 'valley',
      bestTimeToVisit: { from: 'April', to: 'October', notes: 'Spring (April-May) for cherry blossoms, Autumn (Oct) for foliage' },
      activities: ['Trekking', 'Photography', 'Rock Climbing', 'Cultural Tour'],
      altitude: '2,438 m', difficulty: 'Easy',
      isFeatured: true, isHiddenGem: false,
      createdBy: admin._id, status: 'approved',
      tips: ['Carry warm clothes even in summer', 'Try the famous Hunza water', 'Visit Altit and Baltit Forts']
    },
    {
      name: 'Attabad Lake',
      description: `A stunning turquoise lake created in 2010 by a massive landslide. The lake's surreal blue-green color against the surrounding mountains makes it one of Pakistan's most photographed spots.`,
      images: [{ url: 'https://images.unsplash.com/photo-1609766857240-3e6e3c8c3a8e?w=800' }],
      location: { region: 'Hunza', address: 'Attabad, Gojal Valley, Hunza', latitude: 36.4100, longitude: 74.8600 },
      category: 'lake', bestTimeToVisit: { from: 'May', to: 'September' },
      activities: ['Boating', 'Photography', 'Swimming'],
      altitude: '2,638 m', difficulty: 'Easy',
      isFeatured: true, isHiddenGem: false,
      createdBy: admin._id, status: 'approved'
    },
    {
      name: 'Fairy Meadows',
      description: `A lush green meadow at the base of Nanga Parbat, the world's ninth-highest mountain. Fairy Meadows offers some of the most dramatic views of any campsite in the world.`,
      images: [{ url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800' }],
      location: { region: 'Diamer', address: 'Fairy Meadows, Nanga Parbat Base Camp, Diamer', latitude: 35.3833, longitude: 74.5667 },
      category: 'meadow', bestTimeToVisit: { from: 'May', to: 'September' },
      activities: ['Camping', 'Trekking', 'Photography'],
      altitude: '3,300 m', difficulty: 'Moderate',
      isFeatured: true, isHiddenGem: false,
      createdBy: admin._id, status: 'approved',
      tips: ['Jeep ride from Raikot Bridge is an adventure itself', 'Book jeeps in advance', 'Bring warm sleeping bags']
    },
    {
      name: 'Deosai Plains',
      description: `Known as "Land of the Giants," Deosai is one of the highest plateaus in the world. In summer it transforms into a carpet of wildflowers and is home to the endangered Himalayan brown bear.`,
      images: [{ url: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800' }],
      location: { region: 'Astore', address: 'Deosai National Park, Astore, Gilgit-Baltistan', latitude: 34.9833, longitude: 75.3667 },
      category: 'plateau', bestTimeToVisit: { from: 'July', to: 'August' },
      activities: ['Wildlife Watching', 'Photography', 'Camping', 'Jeep Safari'],
      altitude: '4,114 m', difficulty: 'Moderate',
      isFeatured: true, isHiddenGem: false,
      entryFee: 300,
      createdBy: admin._id, status: 'approved'
    },
    {
      name: 'Skardu Valley',
      description: `The gateway to K2 and the Karakoram, Skardu is a high-altitude desert surrounded by towering peaks. Home to ancient forts, crystal-clear lakes, and some of the world's most challenging trekking routes.`  ,
      images: [{ url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800' }],
      location: { region: 'Skardu', address: 'Skardu City, Gilgit-Baltistan', latitude: 35.2971, longitude: 75.6333 },
      category: 'valley', bestTimeToVisit: { from: 'April', to: 'October' },
      activities: ['Trekking', 'Rock Climbing', 'Camping', 'Cultural Tour', 'Jeep Safari'],
      altitude: '2,228 m', difficulty: 'Easy',
      isFeatured: true,
      createdBy: admin._id, status: 'approved'
    },
    {
      name: 'Shangrila Resort Lake',
      description: 'A hidden gem nestled in a valley near Skardu, Shangrila (Lower Kachura Lake) is a serene mountain lake surrounded by fruit trees. The lake-side resort is built into a crashed DC-3 plane.',
      images: [{ url: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800' }],
      location: { region: 'Skardu', address: 'Kachura, Skardu', latitude: 35.3500, longitude: 75.5000 },
      category: 'lake', bestTimeToVisit: { from: 'May', to: 'October' },
      activities: ['Boating', 'Photography', 'Relaxation'],
      altitude: '2,500 m', difficulty: 'Easy',
      isFeatured: false, isHiddenGem: true,
      createdBy: admin._id, status: 'approved'
    },
    {
      name: 'Naltar Valley',
      description: 'A pristine valley famous for its multicolored lakes — the Naltar Lakes display different shades of blue and green. The valley also hosts Pakistan\'s main ski resort and is known for its dense pine forests.',
      images: [{ url: 'https://images.unsplash.com/photo-1609766418204-5e4e6e93ce41?w=800' }],
      location: { region: 'Gilgit', address: 'Naltar Valley, Gilgit', latitude: 36.1500, longitude: 74.2000 },
      category: 'valley', bestTimeToVisit: { from: 'June', to: 'September' },
      activities: ['Skiing', 'Trekking', 'Photography', 'Camping'],
      altitude: '2,898 m', difficulty: 'Moderate',
      isFeatured: false, isHiddenGem: true,
      createdBy: admin._id, status: 'approved'
    }
  ]);

  console.log('✅ Places created');

  // Create properties
  await Property.insertMany([
    {
      title: 'Eagle\'s Nest Hunza View',
      description: 'A luxurious mountain lodge perched high above Hunza Valley offering panoramic views of Rakaposhi, Ladyfinger Peak, and the ancient Baltit Fort. Rooms feature floor-to-ceiling windows.',
      propertyType: 'resort',
      images: [
        { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
        { url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800' }
      ],
      price: 8500,
      location: { address: 'Duikar, Altit, Hunza', city: 'Hunza', region: 'Hunza', latitude: 36.3100, longitude: 74.6800 },
      amenities: ['WiFi', 'Heating', 'Hot Water', 'Meals', 'Guide', 'Mountain View', 'Parking'],
      host: host1._id, maxGuests: 4, bedrooms: 2, bathrooms: 2,
      status: 'approved', rating: 4.9, reviewCount: 48,
      rules: ['No smoking', 'Quiet hours after 10pm', 'Respect local customs'],
      tags: ['luxury', 'mountain view', 'romantic']
    },
    {
      title: 'Old Hunza Inn - Karimabad',
      description: 'A traditional stone guesthouse in the heart of Karimabad, walking distance to Baltit Fort. Family-run with authentic local meals, rooftop terrace with mountain views, and warm hospitality.',
      propertyType: 'guesthouse',
      images: [{ url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800' }],
      price: 3500,
      location: { address: 'Karimabad, Hunza', city: 'Hunza', region: 'Hunza', latitude: 36.3200, longitude: 74.6600 },
      amenities: ['Hot Water', 'Meals', 'WiFi', 'Mountain View'],
      host: host1._id, maxGuests: 6, bedrooms: 3, bathrooms: 2,
      status: 'approved', rating: 4.7, reviewCount: 124,
      tags: ['traditional', 'budget-friendly', 'central location']
    },
    {
      title: 'Shangrila Hotel Skardu',
      description: 'Located on the banks of Lower Kachura Lake, this iconic hotel offers comfortable rooms with lake and mountain views. The famous plane-turned-restaurant is a unique dining experience.',
      propertyType: 'hotel',
      images: [{ url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800' }],
      price: 12000,
      location: { address: 'Kachura Road, Skardu', city: 'Skardu', region: 'Skardu', latitude: 35.3550, longitude: 75.5050 },
      amenities: ['WiFi', 'Heating', 'Hot Water', 'Meals', 'Parking', 'Restaurant', 'Mountain View', 'River View'],
      host: host2._id, maxGuests: 2, bedrooms: 1, bathrooms: 1,
      status: 'approved', rating: 4.5, reviewCount: 87,
      tags: ['lakeside', 'iconic', 'romantic']
    },
    {
      title: 'K2 Base Camp Guesthouse',
      description: 'A comfortable mountaineer\'s guesthouse in Skardu, the base for K2 expeditions. Simple, clean rooms with excellent food. The owner is a seasoned trekking guide who can arrange permits and logistics.',
      propertyType: 'guesthouse',
      images: [{ url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' }],
      price: 2500,
      location: { address: 'Satellite Town, Skardu', city: 'Skardu', region: 'Skardu', latitude: 35.3000, longitude: 75.6200 },
      amenities: ['Hot Water', 'Meals', 'Guide', 'Parking', 'Kitchen'],
      host: host2._id, maxGuests: 8, bedrooms: 4, bathrooms: 3,
      status: 'approved', rating: 4.6, reviewCount: 203,
      tags: ['trekkers', 'expedition', 'mountaineers']
    },
    {
      title: 'Fairy Meadows Log Cabin',
      description: 'Authentic wooden log cabins at 3,300m at the base of Nanga Parbat. Wake up to unobstructed views of the world\'s 9th highest mountain. Solar-powered with campfire evenings included.',
      propertyType: 'cabin',
      images: [{ url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800' }],
      price: 4000,
      location: { address: 'Fairy Meadows, Diamer', city: 'Fairy Meadows', region: 'Diamer', latitude: 35.3833, longitude: 74.5667 },
      amenities: ['Heating', 'Meals', 'Mountain View', 'Guide'],
      host: host1._id, maxGuests: 3, bedrooms: 1, bathrooms: 1,
      status: 'approved', rating: 4.8, reviewCount: 67,
      tags: ['unique', 'adventure', 'off-grid']
    }
  ]);

  console.log('✅ Properties created');

  // Create experiences
  await Experience.insertMany([
    {
      title: 'K2 Base Camp Trek (14 Days)',
      description: 'The legendary trek to the base of K2, the world\'s second highest mountain. Pass through some of the most dramatic glacier landscapes on Earth, crossing the Gondogoro La pass at 5,940m.',
      type: 'trekking',
      images: [{ url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800' }],
      price: 150000,
      duration: { value: 14, unit: 'days' },
      maxGroupSize: 12,
      location: { name: 'Concordia, Karakoram', region: 'Skardu', latitude: 35.7333, longitude: 76.5167 },
      host: host2._id, status: 'approved', isFeatured: true,
      includes: ['Professional guide', 'Porter services', 'All meals on trail', 'Camping equipment', 'Permits'],
      requirements: ['Good physical fitness', 'Trekking experience required', 'Altitude sickness medication'],
      difficultyLevel: 'Expert',
      languages: ['English', 'Urdu'],
      rating: 5.0, reviewCount: 34
    },
    {
      title: 'Jeep Safari Across Deosai Plains',
      description: 'A thrilling 2-day jeep safari across the Deosai National Park, one of the world\'s highest plateaus. Spot Himalayan brown bears, golden marmots, and endemic wildflowers.',
      type: 'jeep-safari',
      images: [{ url: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800' }],
      price: 25000,
      duration: { value: 2, unit: 'days' },
      maxGroupSize: 8,
      location: { name: 'Deosai National Park', region: 'Astore', latitude: 34.9833, longitude: 75.3667 },
      host: host2._id, status: 'approved', isFeatured: true,
      includes: ['4x4 jeep', 'Driver-guide', 'Camping gear', 'All meals', 'Park entry fees'],
      requirements: ['Dress in layers', 'Minimum age 10'],
      difficultyLevel: 'Easy',
      rating: 4.8, reviewCount: 89
    },
    {
      title: 'Hunza Cultural Heritage Tour',
      description: 'A full-day immersive cultural tour of ancient Hunza, visiting Baltit Fort (1000 years old), Altit Fort (900 years old), local village homes, traditional craft workshops, and apricot orchards.',
      type: 'cultural',
      images: [{ url: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800' }],
      price: 5000,
      duration: { value: 8, unit: 'hours' },
      maxGroupSize: 15,
      location: { name: 'Karimabad, Hunza', region: 'Hunza', latitude: 36.3200, longitude: 74.6600 },
      host: host1._id, status: 'approved', isFeatured: true,
      includes: ['Licensed cultural guide', 'Fort entry fees', 'Traditional lunch', 'Craft workshop'],
      requirements: ['Comfortable walking shoes'],
      difficultyLevel: 'Easy',
      languages: ['English', 'Urdu', 'Burushaski'],
      rating: 4.9, reviewCount: 156
    },
    {
      title: 'Rakaposhi Base Camp Trek (3 Days)',
      description: 'A spectacular 3-day trek to the base camp of Rakaposhi (7,788m), one of the most beautiful mountains in the Karakoram. Enjoy stunning views of glaciers and surrounding peaks.',
      type: 'trekking',
      images: [{ url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800' }],
      price: 35000,
      duration: { value: 3, unit: 'days' },
      maxGroupSize: 10,
      location: { name: 'Minapin, Nagar', region: 'Nagar', latitude: 36.2000, longitude: 74.5000 },
      host: host1._id, status: 'approved', isFeatured: false,
      includes: ['Guide', 'Porter', 'Camping equipment', 'Meals'],
      difficultyLevel: 'Moderate',
      rating: 4.7, reviewCount: 45
    },
    {
      title: 'Fairy Meadows Night Camping',
      description: 'An overnight camping experience at Fairy Meadows with unobstructed views of Nanga Parbat lit by moonlight. Includes jeep ride from Raikot Bridge, BBQ dinner, and stargazing session.',
      type: 'camping',
      images: [{ url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800' }],
      price: 15000,
      duration: { value: 2, unit: 'days' },
      maxGroupSize: 10,
      location: { name: 'Fairy Meadows, Diamer', region: 'Diamer', latitude: 35.3833, longitude: 74.5667 },
      host: host1._id, status: 'approved', isFeatured: false,
      includes: ['Jeep transfer', 'Tent', 'Sleeping bag', 'Meals', 'Guide', 'Stargazing guide'],
      difficultyLevel: 'Easy',
      rating: 4.9, reviewCount: 78
    }
  ]);

  console.log('✅ Experiences created');
  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin:  admin@tourista.pk  / admin123');
  console.log('   Host 1: karim@host.pk      / host123');
  console.log('   Host 2: fatima@host.pk     / host123');
  console.log('   User:   ali@user.pk        / user123');

  process.exit(0);
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
