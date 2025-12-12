// Mock data for ClothShare platform

export const campuses = [
    {
        id: 'amity-lucknow',
        name: 'AMITY Lucknow',
        shortName: 'AMITY LKO',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        latitude: 26.8469,
        longitude: 80.9462,
        emailDomains: ['amity.edu', 'student.amity.edu']
    },
    {
        id: 'iit-delhi',
        name: 'IIT Delhi',
        shortName: 'IIT-D',
        city: 'New Delhi',
        state: 'Delhi',
        latitude: 28.5450,
        longitude: 77.1926,
        emailDomains: ['iitd.ac.in']
    },
    {
        id: 'bits-pilani',
        name: 'BITS Pilani',
        shortName: 'BITS',
        city: 'Pilani',
        state: 'Rajasthan',
        latitude: 28.3640,
        longitude: 75.5870,
        emailDomains: ['pilani.bits-pilani.ac.in']
    },
    {
        id: 'christ-bangalore',
        name: 'Christ University',
        shortName: 'Christ BLR',
        city: 'Bangalore',
        state: 'Karnataka',
        latitude: 12.9354,
        longitude: 77.6050,
        emailDomains: ['christuniversity.in']
    }
];

export const categories = [
    {
        id: 'traditional',
        name: 'Traditional Wear',
        icon: '👘',
        subcategories: ['Saree', 'Lehenga', 'Kurta', 'Sherwani', 'Salwar Suit', 'Anarkali']
    },
    {
        id: 'western',
        name: 'Western Wear',
        icon: '👗',
        subcategories: ['Dress', 'Gown', 'Suit', 'Blazer', 'Skirt', 'Jumpsuit']
    },
    {
        id: 'casual',
        name: 'Casual Wear',
        icon: '👕',
        subcategories: ['T-Shirts', 'Jeans', 'Shorts', 'Hoodies', 'Jackets']
    },
    {
        id: 'accessories',
        name: 'Accessories',
        icon: '💎',
        subcategories: ['Jewelry', 'Bags', 'Shoes', 'Watches', 'Sunglasses', 'Belts']
    },
    {
        id: 'event',
        name: 'Event Specific',
        icon: '🎉',
        subcategories: ['Wedding', 'Party', 'Interview', 'College Fest', 'Graduation']
    }
];

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export const colors = [
    { name: 'Red', hex: '#DC2626' },
    { name: 'Blue', hex: '#2563EB' },
    { name: 'Green', hex: '#16A34A' },
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Purple', hex: '#9333EA' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Orange', hex: '#EA580C' },
    { name: 'Black', hex: '#171717' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gold', hex: '#D97706' },
    { name: 'Silver', hex: '#9CA3AF' },
    { name: 'Maroon', hex: '#7F1D1D' }
];

export const users = [
    {
        id: 'user-1',
        name: 'Priya Sharma',
        email: 'priya.sharma@amity.edu',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        bio: 'Fashion enthusiast | Final year MBA | Love sharing ethnic wear!',
        campusId: 'amity-lucknow',
        building: 'Hostel A',
        rating: 4.8,
        reviewCount: 45,
        itemsListed: 12,
        rentalsCompleted: 28,
        memberSince: '2024-01-15'
    },
    {
        id: 'user-2',
        name: 'Sneha Patel',
        email: 'sneha.patel@amity.edu',
        phone: '+91 98765 43211',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        bio: 'Sustainable fashion advocate | BBA Student',
        campusId: 'amity-lucknow',
        building: 'Hostel B',
        rating: 4.9,
        reviewCount: 32,
        itemsListed: 8,
        rentalsCompleted: 22,
        memberSince: '2024-03-20'
    },
    {
        id: 'user-3',
        name: 'Rahul Verma',
        email: 'rahul.verma@amity.edu',
        phone: '+91 98765 43212',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Event organizer | Always dressed to impress',
        campusId: 'amity-lucknow',
        building: 'Boys Hostel C',
        rating: 4.6,
        reviewCount: 18,
        itemsListed: 6,
        rentalsCompleted: 15,
        memberSince: '2024-05-10'
    }
];

export const items = [
    {
        id: 'item-1',
        userId: 'user-1',
        title: 'Red Silk Lehenga with Gold Embroidery',
        description: 'Beautiful red silk lehenga with intricate gold embroidery. Perfect for weddings, sangeet, or festive occasions. Worn only twice, in excellent condition. Comes with matching dupatta and blouse (Size M).',
        categoryId: 'traditional',
        subcategory: 'Lehenga',
        size: 'M',
        color: 'Red',
        brand: 'FabIndia',
        condition: 'Like New',
        dailyPrice: 500,
        securityDeposit: 1000,
        weeklyDiscount: 20,
        images: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500',
            'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500'
        ],
        latitude: 26.8475,
        longitude: 80.9468,
        distance: 120,
        status: 'available',
        viewCount: 245,
        saveCount: 42,
        rating: 4.9,
        reviewCount: 12,
        createdAt: '2024-11-01'
    },
    {
        id: 'item-2',
        userId: 'user-2',
        title: 'Navy Blue Blazer - Formal',
        description: 'Premium navy blue blazer perfect for job interviews, presentations, or formal events. Slim fit design. Barely worn, like new condition.',
        categoryId: 'western',
        subcategory: 'Blazer',
        size: 'L',
        color: 'Blue',
        brand: 'Van Heusen',
        condition: 'Like New',
        dailyPrice: 200,
        securityDeposit: 500,
        weeklyDiscount: 15,
        images: [
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500'
        ],
        latitude: 26.8462,
        longitude: 80.9455,
        distance: 85,
        status: 'available',
        viewCount: 156,
        saveCount: 28,
        rating: 4.5,
        reviewCount: 8,
        createdAt: '2024-10-15'
    },
    {
        id: 'item-3',
        userId: 'user-1',
        title: 'Pearl Jewelry Set - Necklace & Earrings',
        description: 'Elegant freshwater pearl jewelry set including necklace and matching earrings. Perfect for any special occasion. Very delicate and beautiful.',
        categoryId: 'accessories',
        subcategory: 'Jewelry',
        size: 'Free Size',
        color: 'White',
        brand: 'Tanishq',
        condition: 'Good',
        dailyPrice: 150,
        securityDeposit: 800,
        weeklyDiscount: 10,
        images: [
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
        ],
        latitude: 26.8480,
        longitude: 80.9470,
        distance: 200,
        status: 'available',
        viewCount: 98,
        saveCount: 35,
        rating: 5.0,
        reviewCount: 5,
        createdAt: '2024-11-10'
    },
    {
        id: 'item-4',
        userId: 'user-2',
        title: 'Black Cocktail Dress',
        description: 'Stunning black cocktail dress with a flattering A-line silhouette. Perfect for parties, dates, or any evening event. Includes a matching belt.',
        categoryId: 'western',
        subcategory: 'Dress',
        size: 'S',
        color: 'Black',
        brand: 'Zara',
        condition: 'Like New',
        dailyPrice: 300,
        securityDeposit: 600,
        weeklyDiscount: 20,
        images: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'
        ],
        latitude: 26.8465,
        longitude: 80.9460,
        distance: 150,
        status: 'available',
        viewCount: 312,
        saveCount: 67,
        rating: 4.7,
        reviewCount: 15,
        createdAt: '2024-10-20'
    },
    {
        id: 'item-5',
        userId: 'user-3',
        title: 'Designer Sherwani - Royal Blue',
        description: 'Royal blue designer sherwani with gold embroidery. Perfect for weddings, engagement, or festive occasions. Includes churidar pants and stole.',
        categoryId: 'traditional',
        subcategory: 'Sherwani',
        size: 'L',
        color: 'Blue',
        brand: 'Manyavar',
        condition: 'Like New',
        dailyPrice: 600,
        securityDeposit: 1500,
        weeklyDiscount: 25,
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'
        ],
        latitude: 26.8458,
        longitude: 80.9448,
        distance: 180,
        status: 'available',
        viewCount: 178,
        saveCount: 45,
        rating: 4.8,
        reviewCount: 9,
        createdAt: '2024-11-05'
    },
    {
        id: 'item-6',
        userId: 'user-1',
        title: 'Pink Anarkali Suit',
        description: 'Beautiful pastel pink Anarkali suit with delicate thread work. Comes with matching dupatta and pants. Fits like a dream!',
        categoryId: 'traditional',
        subcategory: 'Anarkali',
        size: 'M',
        color: 'Pink',
        brand: 'W',
        condition: 'Good',
        dailyPrice: 350,
        securityDeposit: 700,
        weeklyDiscount: 15,
        images: [
            'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500'
        ],
        latitude: 26.8472,
        longitude: 80.9465,
        distance: 95,
        status: 'available',
        viewCount: 134,
        saveCount: 29,
        rating: 4.6,
        reviewCount: 7,
        createdAt: '2024-10-28'
    },
    {
        id: 'item-7',
        userId: 'user-2',
        title: 'Gold Clutch Bag',
        description: 'Stunning gold evening clutch bag with chain strap. Perfect accessory for parties and formal events. Fits phone, lipstick, and cards.',
        categoryId: 'accessories',
        subcategory: 'Bags',
        size: 'Free Size',
        color: 'Gold',
        brand: 'Aldo',
        condition: 'Like New',
        dailyPrice: 100,
        securityDeposit: 300,
        weeklyDiscount: 10,
        images: [
            'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500'
        ],
        latitude: 26.8468,
        longitude: 80.9458,
        distance: 110,
        status: 'available',
        viewCount: 89,
        saveCount: 21,
        rating: 4.9,
        reviewCount: 6,
        createdAt: '2024-11-08'
    },
    {
        id: 'item-8',
        userId: 'user-3',
        title: 'White Formal Shirt & Tie Set',
        description: 'Crisp white formal shirt with a matching blue tie. Perfect for interviews or formal presentations. Well-maintained and wrinkle-free.',
        categoryId: 'western',
        subcategory: 'Suit',
        size: 'M',
        color: 'White',
        brand: 'Raymond',
        condition: 'Good',
        dailyPrice: 120,
        securityDeposit: 250,
        weeklyDiscount: 10,
        images: [
            'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500'
        ],
        latitude: 26.8455,
        longitude: 80.9445,
        distance: 220,
        status: 'available',
        viewCount: 67,
        saveCount: 14,
        rating: 4.4,
        reviewCount: 4,
        createdAt: '2024-11-12'
    }
];

export const reviews = [
    {
        id: 'review-1',
        itemId: 'item-1',
        userId: 'user-2',
        userName: 'Ananya K.',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        rating: 5,
        comment: 'Beautiful lehenga, exactly as described. Priya was very helpful and flexible with pickup time. Highly recommend!',
        date: '2024-12-10'
    },
    {
        id: 'review-2',
        itemId: 'item-1',
        userId: 'user-3',
        userName: 'Riya M.',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
        rating: 5,
        comment: 'Got so many compliments at my friend\'s wedding! The fit was perfect and the quality is amazing. Easy rental process.',
        date: '2024-12-05'
    },
    {
        id: 'review-3',
        itemId: 'item-2',
        userId: 'user-1',
        userName: 'Arjun T.',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        rating: 4,
        comment: 'Great blazer for my interview. Fit well and looked professional. Quick and smooth transaction.',
        date: '2024-12-01'
    }
];

export const faqs = [
    {
        category: 'Getting Started',
        questions: [
            {
                q: 'How do I sign up for ClothShare?',
                a: 'You can sign up using your college email address or through Google/Facebook login. After signing up, you\'ll need to verify your email and complete your profile setup.'
            },
            {
                q: 'How does the location verification work?',
                a: 'We verify your location through your college email domain and allow you to set your hostel/building location. This helps ensure you can find items within walking distance.'
            },
            {
                q: 'Is my personal information safe?',
                a: 'Yes! We use industry-standard encryption and never share your personal details with other users without your consent. Your exact room number is always kept private.'
            }
        ]
    },
    {
        category: 'Renting Items',
        questions: [
            {
                q: 'How do I search for items near me?',
                a: 'Use the search bar and location filter to find items within 200-300 meters of your campus. You can filter by category, size, price, and more.'
            },
            {
                q: 'What does the security deposit cover?',
                a: 'The security deposit protects the owner against damage or late returns. It\'s fully refundable when you return the item in good condition on time.'
            },
            {
                q: 'How do I pay for rentals?',
                a: 'We accept UPI, debit/credit cards, and net banking through our secure payment partner Razorpay. All transactions are encrypted and safe.'
            }
        ]
    },
    {
        category: 'Listing Items',
        questions: [
            {
                q: 'How do I list an item?',
                a: 'Go to your dashboard and click "Add New Listing". Upload photos, add details like size and condition, set your price, and publish!'
            },
            {
                q: 'What commission does ClothShare take?',
                a: 'We charge a 10% platform fee on successful rentals. This covers payment processing, customer support, and platform maintenance.'
            },
            {
                q: 'How do I set the right price?',
                a: 'We show you suggested prices based on similar items. Generally, daily rentals are 5-10% of the item\'s retail value.'
            }
        ]
    },
    {
        category: 'Payments & Refunds',
        questions: [
            {
                q: 'When do I get my deposit back?',
                a: 'Your deposit is refunded within 24-48 hours after the owner confirms the item was returned in good condition.'
            },
            {
                q: 'What if I need to cancel?',
                a: 'Cancellations more than 24 hours before pickup get a full refund. Cancellations within 24 hours receive a 50% refund.'
            }
        ]
    }
];

// Helper function to get user by ID
export const getUserById = (id) => users.find(u => u.id === id);

// Helper function to get items by user ID
export const getItemsByUserId = (userId) => items.filter(i => i.userId === userId);

// Helper function to get reviews by item ID
export const getReviewsByItemId = (itemId) => reviews.filter(r => r.itemId === itemId);

// Helper function to get campus by ID
export const getCampusById = (id) => campuses.find(c => c.id === id);
