const express = require("express"); 
const mongoose = require('mongoose');
const config = require('./utils/config');
const app = express();
require('./models/trade');
require('./models/portfolio');
mongoose.connect(config.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json())
require('./routes/tradeRoutes')(app);
require('./routes/portfolioRoutes')(app);
require('./routes/returnRoutes')(app);

app.get('*', (req, res)=> {
    res.send("Invalid Route");
});

app.listen(config.PORT, (req, res) => {
    console.log(`Server Started at PORT: ${config.PORT}`);
});