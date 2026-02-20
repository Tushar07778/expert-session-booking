require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Expert = require('../models/Expert');
const connectDB = require('../config/db');


/**
 * Generates time slots for the next N days from today.
 */
const generateSlots = (daysAhead = 7) => {
    const slots = [];
    const timeOptions = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    ];

    for (let i = 1; i <= daysAhead; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        slots.push({ date: dateStr, slots: [...timeOptions] });
    }
    return slots;
};

const experts = [
    {
        name: 'Dr. Arjun Mehta',
        category: 'Technology',
        bio: 'Full-stack architect with 15+ years in scalable systems, cloud infrastructure, and microservices. Former CTO at two funded startups.',
        experience: 15,
        rating: 4.9,
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Priya Sharma',
        category: 'Design',
        bio: 'Award-winning UX/UI designer specializing in product design, user research, and design systems. Led design at Google and Figma.',
        experience: 10,
        rating: 4.8,
        photo: 'https://randomuser.me/api/portraits/women/44.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Rohit Verma',
        category: 'Finance',
        bio: 'Chartered accountant and financial advisor with deep expertise in startup fundraising, tax planning, and wealth management.',
        experience: 12,
        rating: 4.7,
        photo: 'https://randomuser.me/api/portraits/men/65.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Dr. Sneha Nair',
        category: 'Health',
        bio: 'Certified nutritionist and wellness coach helping individuals achieve sustainable health goals through personalized plans.',
        experience: 8,
        rating: 4.9,
        photo: 'https://randomuser.me/api/portraits/women/22.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Vikram Patel',
        category: 'Marketing',
        bio: 'Growth hacker and digital marketing strategist with proven track record scaling SaaS products from 0 to 1M+ users.',
        experience: 9,
        rating: 4.6,
        photo: 'https://randomuser.me/api/portraits/men/11.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Ananya Krishnan',
        category: 'Education',
        bio: 'EdTech curriculum designer and learning strategist. Created courses for 500K+ learners across Coursera and Udemy.',
        experience: 7,
        rating: 4.8,
        photo: 'https://randomuser.me/api/portraits/women/55.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Suresh Iyer',
        category: 'Legal',
        bio: 'Corporate lawyer specializing in startup legal structuring, IP protection, contract law, and regulatory compliance.',
        experience: 14,
        rating: 4.7,
        photo: 'https://randomuser.me/api/portraits/men/78.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Meera Pillai',
        category: 'Business',
        bio: 'Business strategist and executive coach with 11 years helping SMEs and startups achieve sustainable growth and market expansion.',
        experience: 11,
        rating: 4.5,
        photo: 'https://randomuser.me/api/portraits/women/33.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Karan Gupta',
        category: 'Technology',
        bio: 'AI/ML engineer and data scientist with specializations in computer vision, NLP, and deep learning architectures.',
        experience: 6,
        rating: 4.8,
        photo: 'https://randomuser.me/api/portraits/men/45.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Divya Bhat',
        category: 'Design',
        bio: 'Brand identity designer and creative director. Expert in visual storytelling, logo design, and brand strategy for startups.',
        experience: 8,
        rating: 4.6,
        photo: 'https://randomuser.me/api/portraits/women/66.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Rajesh Kumar',
        category: 'Finance',
        bio: 'Investment banker turned angel investor. Mentors early-stage founders on valuation, due diligence, and funding strategy.',
        experience: 16,
        rating: 4.9,
        photo: 'https://randomuser.me/api/portraits/men/20.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Dr. Pooja Desai',
        category: 'Health',
        bio: 'Mental health counselor and psychologist focusing on workplace stress management, burnout recovery, and resilience building.',
        experience: 9,
        rating: 4.7,
        photo: 'https://randomuser.me/api/portraits/women/77.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Aditya Joshi',
        category: 'Marketing',
        bio: 'SEO expert and content strategist who has driven 10x organic growth for multiple D2C brands across e-commerce sectors.',
        experience: 6,
        rating: 4.5,
        photo: 'https://randomuser.me/api/portraits/men/52.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Nisha Agarwal',
        category: 'Business',
        bio: 'Operations consultant helping companies streamline processes, reduce costs, and implement OKR frameworks for team alignment.',
        experience: 10,
        rating: 4.6,
        photo: 'https://randomuser.me/api/portraits/women/88.jpg',
        availableSlots: generateSlots(),
    },
    {
        name: 'Dr. Sanjay Rao',
        category: 'Education',
        bio: 'Academic researcher and professor with expertise in pedagogy, online learning design, and educational psychology.',
        experience: 18,
        rating: 4.8,
        photo: 'https://randomuser.me/api/portraits/men/60.jpg',
        availableSlots: generateSlots(),
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('🗑️  Clearing existing experts...');
        await Expert.deleteMany({});
        console.log('🌱 Seeding experts...');
        await Expert.insertMany(experts);
        console.log(`✅ Successfully seeded ${experts.length} experts!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedDatabase();
