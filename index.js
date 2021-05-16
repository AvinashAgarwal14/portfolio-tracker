const express = require("express"); 
const mongoose = require('mongoose');
const config = require('./utils/config');
const app = express();
require('./models/trade');
require('./models/portfolio');

// Establish connection with mongoDB
mongoose.connect(config.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

// To recognize the incoming request object as a JSON object 
app.use(express.json())
require('./routes/tradeRoutes')(app);
require('./routes/portfolioRoutes')(app);
require('./routes/returnRoutes')(app);

// Default response to an undefined route
app.get('*', (req, res)=> {
    res.send("Invalid Route");
});

app.listen(config.PORT, (req, res) => {
    console.log(`Server Started at PORT: ${config.PORT}`);
});