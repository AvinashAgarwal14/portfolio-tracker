import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './Header';
import Portfolio from './Portfolio';
import ProfitLoss from './ProfitLoss';
import Trades from './trade/Trades';
import Landing from './Landing';

function App() {
  return (
    <div className="container">
      <BrowserRouter>
					<div>
						<Header />
						<Route exact={true} path="/" component={Landing} />
						<Route exact path="/trade" component={Trades} />
						<Route path="/portfolio" component={Portfolio} />
						<Route path="/profitloss" component={ProfitLoss} />
					</div>
				</BrowserRouter>
    </div>
  );
}

export default App;
