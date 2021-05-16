const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    tickerSymbol: String,
    quantity: Number,
    avgPrice: Number,   
});

mongoose.model('portfolio', portfolioSchema);