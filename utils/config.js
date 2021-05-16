if(process.env.NODE_ENV === 'production') {
    module.exports = {
        PORT: process.env.PORT,
        MONGO_URL: process.env.MONGO_URI
    }
} else {
    module.exports = {
        PORT: 5000,
        MONGO_URL: 'mongodb://127.0.0.1/portfolio_tracker'
    }
}