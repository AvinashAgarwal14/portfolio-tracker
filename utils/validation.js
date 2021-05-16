const {check} = require('express-validator');

// Validate input for adding a new trade
const addTradeValidator = [
    check('tickerSymbol', 'tickerSymbol is required').not().isEmpty(),
    check('type', 'Only Buy or Sell trade types are allowed').isIn(['BUY', 'SELL']),
    check('price', 'Enter a positive value for price').isFloat({ gt: 0 }),
    check('quantity', 'Enter a positive integer for quantity').isInt({ gt: 0 }),
]

// Validate input for updating a trade
const updateTradeValidator = [
    check('type', 'Only Buy or Sell trade types are allowed').isIn(['BUY', 'SELL']),
    check('price', 'Enter a positive value for price').isFloat({ gt: 0 }),
    check('quantity', 'Enter a positive integer for quantity').isInt({ gt: 0 }),
]

module.exports = {
    addTradeValidator, updateTradeValidator
}