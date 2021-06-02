const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected!')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 1
        const camp = new Campground({
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: [
                {
                    url: 'https://res.cloudinary.com/dbaucysxw/image/upload/v1621903627/YelpCamp/rdwgasazxzkacz0ssiam.jpg',
                    filename: 'YelpCamp/rdwgasazxzkacz0ssiam'
                },
                {
                    url: 'https://res.cloudinary.com/dbaucysxw/image/upload/v1621903627/YelpCamp/stmlmkoxyo3trdn1qxn6.jpg',
                    filename: 'YelpCamp/stmlmkoxyo3trdn1qxn6'
                }

            ],
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem quibusdam asperiores quia fuga. Ducimus vel est porro saepe dicta accusamus sapiente quae deleniti ullam dolore mollitia voluptas id, dolorem recusandae.',
            price,
            author: '60a42723676f5d2bccc6f4e1'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})