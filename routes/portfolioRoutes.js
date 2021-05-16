const mongoose = require('mongoose');
const Portfolio = mongoose.model('portfolio');

module.exports  = (app) => {
    // Endpoint to get the portfolio
    app.get('/api/portfolio', async (req, res) => {
        try {
            // Query database to get the portfolio
            let portfolio = await Portfolio.find({});
            res.send(portfolio);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });
}