const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema defination for Trades
const tradeSchema = new Schema({
    tickerSymbol: String,
    type: String,
    quantity: Number,
    price: Number,
    timestamp: {type: Date, default: Date.now()
    }
});

mongoose.model('trades', tradeSchema);