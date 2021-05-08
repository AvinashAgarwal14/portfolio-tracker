const mongoose = require('mongoose');
const Portfolio = mongoose.model('portfolio');

module.exports  = (app) => {
    app.get('/portfolio', async (req, res) => {
        try {
            let portfolio = await Portfolio.find({});
            res.send(portfolio);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });
}