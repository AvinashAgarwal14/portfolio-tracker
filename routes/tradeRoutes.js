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
        let trade;
        let updatedPortfolio;
        const {securityName, type, quantity, price} = req.body;
        const prevPortfolio = await Portfolio.find({securityName: securityName});
        try {
            if(prevPortfolio.length){
                let portfolioQuantity = prevPortfolio[0].quantity;
                let portfolioAvgPrice = prevPortfolio[0].avgPrice;
                if(type === "SELL" && quantity > portfolioQuantity) {
                    res.status(400).send({error: "Insufficeint Quanity"});
                    return;
                }
                if(type === "BUY") {
                    portfolioAvgPrice = (portfolioAvgPrice*portfolioQuantity + price*quantity)/(portfolioQuantity+quantity);
                    portfolioQuantity += quantity;
                }
                if(type == "SELL") {
                    portfolioQuantity -= quantity;
                }
                trade = await Trades.create({securityName, type, quantity, price});
                updatedPortfolio = await Portfolio.updateOne(
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
                    res.status(400).send({message: "Insufficeint Quanity"});
                    return;
                }
                trade = await Trades.create({securityName, type, quantity, price});
                updatedPortfolio = await Portfolio.create({securityName, quantity, avgPrice: price});
            }
            res.sendStatus(200);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });

    app.put('/trade/:tradeId', async (req, res) => {
        const tradeId = req.params.tradeId;
        const {securityName, type, quantity, price} = req.body;
        try {
            await Trades.updateOne(
                {
                    _id: tradeId,
                },
                { 
                    securityName, type, quantity, price
                }
            )
            res.sendStatus(200);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });

    app.delete('/trade/:tradeId', async (req, res) => {
        const tradeId = req.params.tradeId;
        try {
            await Trades.deleteOne(
                {
                    _id: tradeId,
                }
            )
            res.sendStatus(200);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });
}