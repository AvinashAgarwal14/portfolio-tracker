const mongoose = require('mongoose');
const Trades = mongoose.model('trades');
const Portfolio = mongoose.model('portfolio');
const {validationResult} = require('express-validator');
const { addTradeValidator, updateTradeValidator } = require('../utils/validation');

module.exports  = (app) => {
    app.get('/api/trades', async (req, res) => {
        try {
            let trades = await Trades.find({});
            res.send(trades);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });

    app.post('/api/trades', addTradeValidator, async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }
        const {tickerSymbol, type, quantity, price} = req.body;
        try {
            const portfolioToUpdate = await Portfolio.findOne({tickerSymbol: tickerSymbol});
            if(portfolioToUpdate){
                let portfolioQuantity = portfolioToUpdate.quantity;
                let portfolioAvgPrice = portfolioToUpdate.avgPrice;
                if(type === "SELL" && quantity > portfolioQuantity) {
                    throw "Insufficeint Quanity";
                }
                if(type === "BUY") {
                    portfolioAvgPrice = (portfolioAvgPrice*portfolioQuantity + price*quantity)/(portfolioQuantity+quantity);
                    portfolioQuantity += quantity;
                }
                if(type === "SELL") {
                    portfolioQuantity -= quantity;
                }
                await Trades.create({tickerSymbol, type, quantity, price});
                await Portfolio.updateOne(
                    {
                        tickerSymbol: tickerSymbol
                    },
                    {
                        quantity: portfolioQuantity,
                        avgPrice: portfolioAvgPrice
                    }
                );
            } else {
                if(type === "SELL") {
                    throw "Insufficeint Quanity";
                }
                await Trades.create({tickerSymbol, type, quantity, price});
                await Portfolio.create({tickerSymbol, quantity, avgPrice: price});
            }
            res.sendStatus(200);
        } catch (err) {
            res.status(400).send({error: err.message || err });
        }
    });

    app.put('/api/trades/:tradeId', updateTradeValidator, async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }
        const tradeId = req.params.tradeId;
        const {type, quantity, price} = req.body;
        try {
            let tradeToUpdate = (await Trades.find({_id: tradeId}))[0];
            let portfolioToUpdate = (await Portfolio.find({tickerSymbol: tradeToUpdate.tickerSymbol}))[0];
            if(tradeToUpdate.type === 'BUY') {
                if(portfolioToUpdate.quantity === tradeToUpdate.quantity)
                    portfolioToUpdate.avgPrice = 0;
                else
                    portfolioToUpdate.avgPrice = (portfolioToUpdate.avgPrice*portfolioToUpdate.quantity - tradeToUpdate.price*tradeToUpdate.quantity)/(portfolioToUpdate.quantity-tradeToUpdate.quantity);
                portfolioToUpdate.quantity -= tradeToUpdate.quantity;
            } else {
                portfolioToUpdate.quantity += tradeToUpdate.quantity;
            }
            tradeToUpdate.type = type;
            tradeToUpdate.quantity = quantity;
            tradeToUpdate.price = price;
            if(type === "SELL" && quantity > portfolioToUpdate.quantity) {
                throw "Insufficeint Quanity";
            }
            if(type === "BUY") {
                portfolioToUpdate.avgPrice = (portfolioToUpdate.avgPrice*portfolioToUpdate.quantity + price*quantity)/(portfolioToUpdate.quantity+quantity);
                portfolioToUpdate.quantity += quantity;
            }
            if(type === "SELL") {
                portfolioToUpdate.quantity -= quantity;
            }
            await tradeToUpdate.save();
            await portfolioToUpdate.save();
            res.sendStatus(200);
        } catch (err) {
            res.status(400).send({error: err.message || err });
        }
    });

    app.delete('/api/trades/:tradeId', async (req, res) => {
        const tradeId = req.params.tradeId;
        try {
            const tradeToDelete = (await Trades.find({_id: tradeId}))[0];
            let portfolioToUpdate = (await Portfolio.find({tickerSymbol: tradeToDelete.tickerSymbol}))[0];
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
            await portfolioToUpdate.save();
            res.sendStatus(200);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });
}

// const session = await mongoose.startSession();
// session.startTransaction();
// await session.commitTransaction();
// session.endSession();
// await session.abortTransaction();
// session.endSession();