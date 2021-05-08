const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    securityName: String,
    quantity: Number,
    avgPrice: Number,   
});

mongoose.model('portfolio', portfolioSchema);