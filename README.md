# forex-arbitrage
Script that detects arbitrage opportunities in the OANDA currency exchange markets.
Makes calls to the OANDA API to acquire forex data. This data is then analyzed for triangular arbitrage opportunities within the OANDA platform.

# How to use
Make sure Node.js is installed on your machine. I am using version 4.4.7.
Run `npm install` in the cloned repository.
Run `node app.js` to run the app.
If there are any arbitrage opportunities, they will be printed into console. 
`1.0000238273387: ZAR_GBP 0.05172698291509481 -> GBP_EUR 1.191057539989757 -> EUR_ZAR 16.12289`
If there is no output, that means there are no opportunities. More often than not, this is the case. In fact, I have yet to detect an arbitrage on OANDA's platform.
