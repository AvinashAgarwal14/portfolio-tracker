const mongoose = require('mongoose');
const Trades = mongoose.model('trades');
module.exports  = (app) => {
    app.get('/trade', async (req, res) => {
        let trades = await Trades.find({});
        res.send(trades);
    });

    app.post('/trade', async (req, res) => {
        const {securityName, type, quantity, price} = req.body;
        const trade = new Trades({securityName, type, quantity, price});
        try {
            await trade.save()
            res.sendStatus(200);
        } catch (err) {
            res.status(422).send(err);
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
            res.status(422).send(err);
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
            res.status(422).send(err);
        }
    });
}