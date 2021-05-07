const express = require("express"); 
const mongoose = require('mongoose');
const app = express();
require('./models/trade');
mongoose.connect('mongodb://127.0.0.1/portfolio_tracker', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json())
require('./routes/tradeRoutes')(app);
const Trades = mongoose.model('trades');
app.get('/trade', async (req, res) => {
    let trades = await Trades.find({});
    res.send(trades);
});

app.post('/trade', async (req, res) => {
    console.log(req.body);
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
    const {securityName, type, quantity, price} = req.body;
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

app.listen(5000, (req, res) => {
    console.log("Server Started!");
});