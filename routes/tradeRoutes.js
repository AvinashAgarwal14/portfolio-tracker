const mongoose = require('mongoose');
const Trades = mongoose.model('trades');
const Portfolio = mongoose.model('portfolio');
const {validationResult} = require('express-validator');
const { addTradeValidator, updateTradeValidator } = require('../utils/validation');

module.exports  = (app) => {
    // Endpoint to get the list of all trades
    app.get('/api/trades', async (req, res) => {
        try {
            // Query database to get a list of all trades
            let trades = await Trades.find({});
            res.send(trades);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });

    // Endpoint to add a new trade
    app.post('/api/trades', addTradeValidator, async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // return error in case of invalid request body
            return res.status(400).json({ errors: errors.array() })
        }
        const {tickerSymbol, type, quantity, price} = req.body;
        try {
            const portfolioToUpdate = await Portfolio.findOne({tickerSymbol: tickerSymbol});
            if(portfolioToUpdate){
                // Update Portfolio as the security was already present
                let portfolioQuantity = portfolioToUpdate.quantity;
                let portfolioAvgPrice = portfolioToUpdate.avgPrice;
                if(type === "SELL" && quantity > portfolioQuantity) {
                    throw new Error("Insufficeint Quanity");
                }
                // Calculate avg price and quantity
                if(type === "BUY") {
                    portfolioAvgPrice = (portfolioAvgPrice*portfolioQuantity + price*quantity)/(portfolioQuantity+quantity);
                    portfolioQuantity += quantity;
                }
                if(type === "SELL") {
                    portfolioQuantity -= quantity;
                }
                await Trades.create({tickerSymbol, type, quantity, price});
                // Remove from Portfolio if quantity is 0
                if(portfolioToUpdate.quantity === 0){
                    await Portfolio.deleteOne({tickerSymbol: portfolioToUpdate.tickerSymbol});
                } else {
                    await Portfolio.updateOne(
                        {
                            tickerSymbol: tickerSymbol
                        },
                        {
                            quantity: portfolioQuantity,
                            avgPrice: portfolioAvgPrice
                        }
                    );
                }
            } else {
                // Add the security to Portfolio as it is being bought for the first time
                // Cannot Short a security
                if(type === "SELL") {
                    throw new Error("Insufficeint Quanity");
                }
                await Trades.create({tickerSymbol, type, quantity, price});
                await Portfolio.create({tickerSymbol, quantity, avgPrice: price});
            }
            res.sendStatus(200);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });

    // Endpoint to update a trade
    app.put('/api/trades/:tradeId', updateTradeValidator, async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // return error in case of invalid request body
            return res.status(400).json({ errors: errors.array() })
        }
        const tradeId = req.params.tradeId;
        const {type, quantity, price} = req.body;
        try {
            let tradeToUpdate = await Trades.findOne({_id: tradeId});
            let portfolioToUpdate = await Portfolio.findOne({tickerSymbol: tradeToUpdate.tickerSymbol});
            // Undo the effect of trade on portfolio to be updated
            if(tradeToUpdate.type === 'BUY') {
                if(portfolioToUpdate.quantity === tradeToUpdate.quantity)
                    portfolioToUpdate.avgPrice = 0;
                else
                    portfolioToUpdate.avgPrice = (portfolioToUpdate.avgPrice*portfolioToUpdate.quantity - tradeToUpdate.price*tradeToUpdate.quantity)/(portfolioToUpdate.quantity-tradeToUpdate.quantity);
                portfolioToUpdate.quantity -= tradeToUpdate.quantity;
            } else {
                portfolioToUpdate.quantity += tradeToUpdate.quantity;
            }
            // Update the trade
            tradeToUpdate.type = type;
            tradeToUpdate.quantity = quantity;
            tradeToUpdate.price = price;
            if(type === "SELL" && quantity > portfolioToUpdate.quantity) {
                throw new Error("Insufficeint Quanity");
            }
            // Update portfolio with the new trade
            if(type === "BUY") {
                portfolioToUpdate.avgPrice = (portfolioToUpdate.avgPrice*portfolioToUpdate.quantity + price*quantity)/(portfolioToUpdate.quantity+quantity);
                portfolioToUpdate.quantity += quantity;
            }
            if(type === "SELL") {
                portfolioToUpdate.quantity -= quantity;
            }
            await tradeToUpdate.save();
            // Remove from Portfolio if quantity is 0
            if(portfolioToUpdate.quantity === 0){
                await Portfolio.deleteOne({tickerSymbol: portfolioToUpdate.tickerSymbol});
            } else {
                await portfolioToUpdate.save();
            }
            res.sendStatus(200);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });

    // Endpoint to delete a trade
    app.delete('/api/trades/:tradeId', async (req, res) => {
        const tradeId = req.params.tradeId;
        try {
            const tradeToDelete = (await Trades.find({_id: tradeId}))[0];
            let portfolioToUpdate = (await Portfolio.find({tickerSymbol: tradeToDelete.tickerSymbol}))[0];
            // Undo the effect of trade on portfolio to be deleted
            if(tradeToDelete.type === 'BUY') {
                if(portfolioToUpdate.quantity === tradeToDelete.quantity)
                    portfolioToUpdate.avgPrice = 0;
                else
                    portfolioToUpdate.avgPrice = (portfolioToUpdate.avgPrice*portfolioToUpdate.quantity - tradeToDelete.price*tradeToDelete.quantity)/(portfolioToUpdate.quantity-tradeToDelete.quantity);
                portfolioToUpdate.quantity -= tradeToDelete.quantity;
            } else {
                portfolioToUpdate.quantity += tradeToDelete.quantity;
            }
            await Trades.deleteOne({_id: tradeId});
            // Remove from Portfolio if quantity is 0
            if(portfolioToUpdate.quantity === 0){
                await Portfolio.deleteOne({tickerSymbol: portfolioToUpdate.tickerSymbol});
            } else {
                await portfolioToUpdate.save();
            }
            res.sendStatus(200);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });
}