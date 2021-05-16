if(process.env.NODE_ENV === 'production') {
    // Env variables for production env
    module.exports = {
        PORT: process.env.PORT,
        MONGO_URL: process.env.MONGO_URI
    }
} else {
    // Env variables for development env
    module.exports = {
        PORT: 5000,
        MONGO_URL: 'mongodb://127.0.0.1/portfolio_tracker'
    }
}