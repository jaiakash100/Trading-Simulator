package com.cit.trading.model;

public class TradingBot extends BaseOrder {
    private String strategyName;

    public TradingBot() {
        super();
        this.strategyName = "LimitTriggerBot";
    }

    public TradingBot(String ticker, String orderType, int quantity, double targetPrice, String strategyName) {
        super(ticker, orderType, quantity, targetPrice);
        this.strategyName = strategyName;
    }

    @Override
    public boolean checkAndExecute(double currentPrice) {
        if (isExecuted()) {
            return false;
        }

        // Relational control statements
        if ("BUY".equalsIgnoreCase(getOrderType())) {
            // Buy limit order triggers when current price falls below or meets target
            if (currentPrice <= getTargetPrice()) {
                setExecuted(true);
                return true;
            }
        } else if ("SELL".equalsIgnoreCase(getOrderType())) {
            // Sell limit order triggers when current price rises above or meets target
            if (currentPrice >= getTargetPrice()) {
                setExecuted(true);
                return true;
            }
        }
        return false;
    }

    public String getStrategyName() {
        return strategyName;
    }

    public void setStrategyName(String strategyName) {
        this.strategyName = strategyName;
    }
}
