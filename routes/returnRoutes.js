const mongoose = require('mongoose');
const Portfolio = mongoose.model('portfolio');

module.exports  = (app) => {
    // Endpoint to get the returns
    app.get('/api/returns', async (req, res) => {
        const currentPrice = 100;
        // Calculate returns based on current price
        try {
            let portfolioReturns = await Portfolio.aggregate(
                [
                    {
                        $group: {
                            _id: "",
                            total: {$sum: {$multiply: [{$subtract: [currentPrice, "$avgPrice"]}, "$quantity"]}}
                        }
                    }, 
                    {
                        $project: {
                            _id: 0,
                            total: 1
                        }
                    }
                ]
            )
            res.send(portfolioReturns);
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    });
}