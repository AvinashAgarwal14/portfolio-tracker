const mongoose = require('mongoose');
const Portfolio = mongoose.model('portfolio');

module.exports  = (app) => {
    app.get('/returns', async (req, res) => {
        const currentPrice = 2000;
        try {
            let portfolio = await Portfolio.find({});
            let portfolioReturns = portfolio.map((security)=>{
                let returns = (currentPrice-security.avgPrice)*security.quantity;
                return {
                    "securityName": security.securityName,
                    "avgPrice": security.avgPrice,
                    "currentPrice": currentPrice,
                    "quantity": security.quantity,
                    "returns": returns
                }
            })
            res.send(portfolioReturns);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });
}