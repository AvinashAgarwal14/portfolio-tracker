const mongoose = require('mongoose');
const Portfolio = mongoose.model('portfolio');

module.exports  = (app) => {
    app.get('/portfolio', async (req, res) => {
        let portfolio = await Portfolio.find({});
        res.send(portfolio);
    });
}