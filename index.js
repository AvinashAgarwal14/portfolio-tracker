const express = require("express"); 
const mongoose = require('mongoose');
const app = express();
require('./models/trade');
require('./models/portfolio');
mongoose.connect('mongodb://127.0.0.1/portfolio_tracker', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json())
require('./routes/tradeRoutes')(app);
require('./routes/portfolioRoutes')(app);
require('./routes/returnRoutes')(app);

app.listen(5000, (req, res) => {
    console.log("Server Started!");
});