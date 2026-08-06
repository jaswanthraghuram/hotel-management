const {
  sequelize,
  Role,
  User,
  RoomType,
  Room,
  RoomImage,
  FoodCategory,
  FoodItem,
  Booking,
  BookingDetail,
  Payment,
  Complaint,
  Review
} = require('../models')

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Starting database sync and seed process...')
    await sequelize.sync({ force: true }) // Fresh tables for clean startup

    // 1. Seed Roles
    const roles = await Role.bulkCreate([
      { id: 1, name: 'Admin', description: 'Executive Administrator with full system control' },
      { id: 2, name: 'Customer', description: 'Registered guest and customer user' },
      { id: 3, name: 'Staff', description: 'Hotel staff and room service operator' }
    ])

    // 2. Seed Users (Admin & Customer)
    const adminUser = await User.create({
      roleId: 1,
      fullName: 'Lord Alexander Vance',
      email: 'admin@grandhaven.com',
      phone: '+1 800-555-0199',
      password: 'admin123', // Will be hashed by User hooks
      address: 'Grand Haven Executive Suites, Floor 12',
      idProof: 'ADM-99401-PASSPORT',
      status: 'active'
    })

    const customerUser = await User.create({
      roleId: 2,
      fullName: 'Lady Eleanor Vance',
      email: 'customer@grandhaven.com',
      phone: '+1 800-555-0240',
      password: 'customer123',
      address: '742 Evergreen Terrace, Beverly Hills, CA',
      idProof: 'DL-88240-CA',
      status: 'active'
    })

    const staffUser = await User.create({
      roleId: 3,
      fullName: 'Michael Scott (Staff Lead)',
      email: 'staff@grandhaven.com',
      phone: '+1 800-555-0311',
      password: 'staff123',
      address: 'Grand Haven Staff Quarters',
      idProof: 'STAFF-104',
      status: 'active'
    })

    // 3. Seed Room Types
    const roomTypes = await RoomType.bulkCreate([
      { id: 1, name: 'Single', basePrice: 120.00, capacity: 1, description: 'Elegant single room with king bed and city view', amenities: 'WiFi, AC, Smart TV, Mini Bar' },
      { id: 2, name: 'Double', basePrice: 190.00, capacity: 2, description: 'Spacious double bed room with private balcony', amenities: 'WiFi, AC, Smart TV, Mini Bar, Ocean View' },
      { id: 3, name: 'Deluxe', basePrice: 280.00, capacity: 2, description: 'Luxury deluxe room with king bed, Jacuzzi bath, and sea view', amenities: 'WiFi, AC, Smart TV, Jacuzzi, Espresso Bar' },
      { id: 4, name: 'Family', basePrice: 380.00, capacity: 4, description: 'Family suite with 2 bedrooms, lounge, and kitchenette', amenities: 'WiFi, AC, 2 Smart TVs, Kitchenette, Dining Table' },
      { id: 5, name: 'Suite', basePrice: 650.00, capacity: 4, description: 'Presidential Royal Suite with panoramic ocean deck and private pool', amenities: 'Private Pool, Butler Service, Ocean Deck, WiFi, Jacuzzi' }
    ])

    // 4. Seed Rooms
    const rooms = await Room.bulkCreate([
      { roomNumber: '101', roomTypeId: 1, floor: 1, price: 120.00, status: 'Available', isBookable: true, description: 'Single Deluxe King Bed' },
      { roomNumber: '102', roomTypeId: 1, floor: 1, price: 120.00, status: 'Available', isBookable: true, description: 'Single Deluxe King Bed' },
      { roomNumber: '201', roomTypeId: 2, floor: 2, price: 190.00, status: 'Occupied', isBookable: false, description: 'Double Balcony Ocean Suite' },
      { roomNumber: '202', roomTypeId: 2, floor: 2, price: 190.00, status: 'Reserved', isBookable: false, description: 'Double Balcony Ocean Suite' },
      { roomNumber: '301', roomTypeId: 3, floor: 3, price: 280.00, status: 'Available', isBookable: true, description: 'Deluxe Sea View & Jacuzzi' },
      { roomNumber: '302', roomTypeId: 3, floor: 3, price: 280.00, status: 'Cleaning', isBookable: false, description: 'Deluxe Sea View & Jacuzzi' },
      { roomNumber: '401', roomTypeId: 4, floor: 4, price: 380.00, status: 'Available', isBookable: true, description: 'Grand Family Villa Suite' },
      { roomNumber: '501', roomTypeId: 5, floor: 5, price: 650.00, status: 'Available', isBookable: true, description: 'Presidential Penthouse Royal Villa' },
      { roomNumber: '502', roomTypeId: 5, floor: 5, price: 650.00, status: 'Maintenance', isBookable: false, description: 'Presidential Penthouse Royal Villa' }
    ])

    // Seed Room Images
    await RoomImage.bulkCreate([
      { roomId: 1, imageUrl: '/images/rooms/single-1.jpg', isPrimary: true },
      { roomId: 3, imageUrl: '/images/rooms/double-1.jpg', isPrimary: true },
      { roomId: 5, imageUrl: '/images/rooms/deluxe-1.jpg', isPrimary: true },
      { roomId: 7, imageUrl: '/images/rooms/family-1.jpg', isPrimary: true },
      { roomId: 8, imageUrl: '/images/rooms/suite-1.jpg', isPrimary: true }
    ])

    // 5. Seed Food Categories & Items
    const foodCatBreakfast = await FoodCategory.create({ name: 'Breakfast', description: 'Morning fresh gourmet breakfast & bakery', icon: 'fa-coffee' })
    const foodCatLunch = await FoodCategory.create({ name: 'Lunch & Dinner', description: 'Chef special main courses & grills', icon: 'fa-utensils' })
    const foodCatBeverages = await FoodCategory.create({ name: 'Beverages & Cocktails', description: 'Fine wines, fresh juices, and signature espresso', icon: 'fa-glass-martini' })
    const foodCatDesserts = await FoodCategory.create({ name: 'Desserts', description: 'Artisanal cakes, ice creams, and pastries', icon: 'fa-ice-cream' })

    await FoodItem.bulkCreate([
      { foodCategoryId: foodCatBreakfast.id, name: 'Royal Grand Continental Breakfast', description: 'Scrambled eggs, smoked salmon, croissant, fresh berries, coffee', price: 28.50, isAvailable: true },
      { foodCategoryId: foodCatBreakfast.id, name: 'Avocado Toast with Poached Eggs', description: 'Sourdough toast, organic avocado, cherry tomatoes, Hollandaise', price: 18.00, isAvailable: true },
      { foodCategoryId: foodCatLunch.id, name: 'Grilled Filet Mignon Steak', description: 'Aged Angus beef, truffle mashed potato, asparagus, red wine jus', price: 54.00, isAvailable: true },
      { foodCategoryId: foodCatLunch.id, name: 'Lobster & Seafood Tagliatelle', description: 'Fresh Atlantic lobster, wild shrimp, garlic cream parmesan sauce', price: 42.00, isAvailable: true },
      { foodCategoryId: foodCatBeverages.id, name: 'Grand Haven Gold Sunset Cocktail', description: 'Aged rum, passionfruit, elderflower liqueur, edible gold leaf', price: 22.00, isAvailable: true },
      { foodCategoryId: foodCatBeverages.id, name: 'Artisanal Double Espresso', description: 'Ethiopian Single Origin roasted espresso', price: 7.50, isAvailable: true },
      { foodCategoryId: foodCatDesserts.id, name: 'Belgian Dark Chocolate Lava Cake', description: 'Warm molten chocolate cake with vanilla bean ice cream', price: 14.50, isAvailable: true }
    ])

    // 6. Seed Sample Active Booking & Payment
    const sampleBooking = await Booking.create({
      bookingNumber: 'GH-2026-98104',
      userId: customerUser.id,
      customerName: 'Lady Eleanor Vance',
      customerEmail: 'customer@grandhaven.com',
      customerPhone: '+1 800-555-0240',
      bookingType: 'Online',
      checkInDate: '2026-08-05',
      checkOutDate: '2026-08-08',
      status: 'CheckedIn',
      totalAmount: 570.00,
      specialRequests: 'High floor with ocean view balcony'
    })

    await BookingDetail.create({
      bookingId: sampleBooking.id,
      roomId: 3, // Room 201
      pricePerNight: 190.00,
      nights: 3,
      subtotal: 570.00
    })

    await Payment.create({
      bookingId: sampleBooking.id,
      paymentNumber: 'PAY-8840192',
      amount: 570.00,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      gstAmount: 68.40,
      serviceCharge: 28.50,
      discount: 0.00,
      finalTotal: 666.90,
      paidAt: new Date()
    })

    // Seed Sample Complaint
    await Complaint.create({
      complaintNumber: 'CMP-10492',
      userId: customerUser.id,
      roomId: 3,
      roomNumber: '201',
      category: 'WiFi Problem',
      description: 'WiFi signal strength is low in the balcony area.',
      status: 'In Progress',
      assignedStaffId: staffUser.id,
      assignedStaffName: 'Michael Scott',
      resolutionNotes: 'Staff dispatched with high-gain WiFi repeater.'
    })

    // Seed Sample Review
    await Review.create({
      userId: customerUser.id,
      userName: 'Lady Eleanor Vance',
      rating: 5,
      comment: 'An extraordinary luxury stay! Exceptional concierge service and stunning ocean views.',
      isApproved: true
    })

    console.log('[Seeder] Database seeding completed successfully!')
  } catch (err) {
    console.error('[Seeder] Error seeding database:', err)
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit())
}

module.exports = seedDatabase
