const mongoose = require('mongoose');
const Trades = mongoose.model('trades');
const Portfolio = mongoose.model('portfolio');

module.exports  = (app) => {
    app.get('/trade', async (req, res) => {
        try {
            let trades = await Trades.find({});
            res.send(trades);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });

    app.post('/trade', async (req, res) => {
        const {securityName, type, quantity, price} = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const portfolioToUpdate = await Portfolio.find({securityName: securityName});
            if(portfolioToUpdate.length){
                let portfolioQuantity = portfolioToUpdate[0].quantity;
                let portfolioAvgPrice = portfolioToUpdate[0].avgPrice;
                if(type === "SELL" && quantity > portfolioQuantity) {
                    throw "Insufficeint Quanity";
                }
                if(type === "BUY") {
                    portfolioAvgPrice = (portfolioAvgPrice*portfolioQuantity + price*quantity)/(portfolioQuantity+quantity);
                    portfolioQuantity += quantity;
                }
                if(type == "SELL") {
                    portfolioQuantity -= quantity;
                }
                await Trades.create({securityName, type, quantity, price});
                await Portfolio.updateOne(
                    {
                        securityName: securityName
                    },
                    {
                        quantity: portfolioQuantity,
                        avgPrice: portfolioAvgPrice
                    }
                );
            } else {
                if(type == "SELL") {
                    throw "Insufficeint Quanity";
                }
                await Trades.create({securityName, type, quantity, price});
                await Portfolio.create({securityName, quantity, avgPrice: price});
            }
            await session.commitTransaction();
            session.endSession();
            res.sendStatus(200);
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).send({error: err.message});
        }
    });

    app.put('/trade/:tradeId', async (req, res) => {
        const tradeId = req.params.tradeId;
        const {securityName, type, quantity, price} = req.body;
        try {
            let tradeToUpdate = (await Trades.find({_id: tradeId}))[0];
            let portfolioToUpdate = (await Portfolio.find({securityName: tradeToUpdate.securityName}))[0];
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
            await session.commitTransaction();
            session.endSession();
            res.sendStatus(200);
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).send({error: err.message});
        }
    });

    app.delete('/trade/:tradeId', async (req, res) => {
        const tradeId = req.params.tradeId;
        try {
            const tradeToDelete = (await Trades.find({_id: tradeId}))[0];
            let portfolioToUpdate = (await Portfolio.find({securityName: tradeToDelete.securityName}))[0];
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
            await session.commitTransaction();
            session.endSession();
            res.sendStatus(200);
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).send({error: err.message});
        }
    });
}