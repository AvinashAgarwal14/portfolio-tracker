## Portfolio Tracker APIs

### Running the Application Locally
```
1. git clone https://github.com/AvinashAgarwal14/portfolio-tracker.git
2. cd portfolio-tracker
3. npm install
4. npm start
```

### Endpoints

#### Trades related
1. GET `/api/trades`

   ```
   Response:  
   Success: 200  
   [{  
     "timestamp" : Date,  
     "tickerSymbol": String,  
     "type": String,   
     "quantity": Number,  
     "price": Number
   }]

   Failure: 400  
   ```

2. POST `/api/trades`

   ```
   Request Body:
   {  
     "tickerSymbol": String,  
     "type": String,   
     "quantity": Number,  
     "price": Number
   }

   Response:  
   Success: 200   
   Failure: 400  
   ```

3. PUT `/api/trades/tradeId`

   ```
   Request Params: tradeId  
   Request Body:
   {  
     "type": String,   
     "quantity": Number,  
     "price": Number
   }

   Response:  
   Success: 200   
   Failure: 400  
   ```

4. DELETE `/api/trades/tradeId`

   ```
   Request Params: tradeId  

   Response:  
   Success: 200   
   Failure: 400  
   ```


#### Portfolio related
1. GET `/api/portfolio`

   ```
   Response:  
   Success: 200  
   [{  
     "tickerSymbol": String,    
     "quantity": Number,  
     "avgPrice": Number
   }]

   Failure: 400  
   ```

#### Returns
1. GET `/api/returns`
  
   ```
   Response:  
   Success: 200  
   [{  
     "total": Number,    
   }]

   Failure: 400  
   ```

### Postman Collection
Collection Link - https://www.getpostman.com/collections/3e78a859587fd858b818  
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3e78a859587fd858b818)