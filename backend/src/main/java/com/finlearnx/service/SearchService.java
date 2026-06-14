package com.finlearnx.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SearchService {

    // Static course catalog for search
    private static final List<Map<String, Object>> COURSES = List.of(
        Map.of("id","personal-finance","title","Introduction to Personal Finance","type","basic","icon","💰","path","/learn/personal-finance"),
        Map.of("id","sip-basics","title","SIP Basics","type","basic","icon","📈","path","/learn/sip-basics"),
        Map.of("id","budget-basics","title","Budget Planning Fundamentals","type","basic","icon","📊","path","/learn/budget-basics"),
        Map.of("id","intro-stocks","title","Introduction to Stocks","type","basic","icon","📉","path","/learn/intro-stocks"),
        Map.of("id","saving-strategies","title","Saving Strategies","type","basic","icon","🏦","path","/learn/saving-strategies"),
        Map.of("id","financial-discipline","title","Financial Discipline","type","basic","icon","🏆","path","/learn/financial-discipline"),
        Map.of("id","investment-planning","title","Investment Planning","type","intermediate","icon","🎯","path","/learn/investment-planning"),
        Map.of("id","portfolio-basics","title","Portfolio Basics","type","intermediate","icon","🗂️","path","/learn/portfolio-basics"),
        Map.of("id","intermediate-stocks","title","Intermediate Stock Market","type","intermediate","icon","📊","path","/learn/intermediate-stocks"),
        Map.of("id","crypto-fundamentals","title","Cryptocurrency Fundamentals","type","intermediate","icon","₿","path","/learn/crypto-fundamentals"),
        Map.of("id","expense-management","title","Expense Management","type","intermediate","icon","💳","path","/learn/expense-management"),
        Map.of("id","financial-goals","title","Financial Goal Planning","type","intermediate","icon","🗺️","path","/learn/financial-goals"),
        Map.of("id","value-investing","title","Value Investing Mastery","type","premium","icon","📊","path","/premium/value-investing"),
        Map.of("id","wealth-psychology","title","Psychology of Money & Wealth","type","premium","icon","🧠","path","/premium/wealth-psychology"),
        Map.of("id","growth-investing","title","Growth Stock Investing","type","premium","icon","🚀","path","/premium/growth-investing"),
        Map.of("id","trading-psychology","title","Trading Psychology & Discipline","type","premium","icon","⚡","path","/premium/trading-psychology"),
        Map.of("id","financial-freedom","title","Financial Freedom Blueprint","type","premium","icon","🏆","path","/premium/financial-freedom"),
        Map.of("id","technical-analysis-pro","title","Professional Technical Analysis","type","premium","icon","📈","path","/premium/technical-analysis-pro")
    );

    private static final List<Map<String, Object>> STOCKS = List.of(
        Map.of("symbol","RELIANCE","name","Reliance Industries","sector","Energy","exchange","NSE"),
        Map.of("symbol","TCS","name","Tata Consultancy Services","sector","IT","exchange","NSE"),
        Map.of("symbol","INFY","name","Infosys Limited","sector","IT","exchange","NSE"),
        Map.of("symbol","HDFCBANK","name","HDFC Bank","sector","Banking","exchange","NSE"),
        Map.of("symbol","ICICIBANK","name","ICICI Bank","sector","Banking","exchange","NSE"),
        Map.of("symbol","WIPRO","name","Wipro Limited","sector","IT","exchange","NSE"),
        Map.of("symbol","SBIN","name","State Bank of India","sector","Banking","exchange","NSE"),
        Map.of("symbol","MARUTI","name","Maruti Suzuki India","sector","Auto","exchange","NSE"),
        Map.of("symbol","AAPL","name","Apple Inc.","sector","Technology","exchange","NASDAQ"),
        Map.of("symbol","TSLA","name","Tesla Inc.","sector","Auto/EV","exchange","NASDAQ"),
        Map.of("symbol","AMZN","name","Amazon.com Inc.","sector","E-Commerce","exchange","NASDAQ"),
        Map.of("symbol","GOOGL","name","Alphabet Inc.","sector","Technology","exchange","NASDAQ"),
        Map.of("symbol","MSFT","name","Microsoft Corporation","sector","Technology","exchange","NASDAQ"),
        Map.of("symbol","NVDA","name","NVIDIA Corporation","sector","Semiconductors","exchange","NASDAQ"),
        Map.of("symbol","META","name","Meta Platforms Inc.","sector","Social Media","exchange","NASDAQ")
    );

    public Map<String, Object> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Map.of("courses", List.of(), "stocks", List.of(), "total", 0);
        }
        String q = query.toLowerCase().trim();

        List<Map<String, Object>> courseResults = COURSES.stream()
                .filter(c -> c.get("title").toString().toLowerCase().contains(q)
                        || c.get("id").toString().toLowerCase().contains(q)
                        || c.get("type").toString().toLowerCase().contains(q))
                .limit(5)
                .toList();

        List<Map<String, Object>> stockResults = STOCKS.stream()
                .filter(s -> s.get("symbol").toString().toLowerCase().contains(q)
                        || s.get("name").toString().toLowerCase().contains(q)
                        || s.get("sector").toString().toLowerCase().contains(q))
                .limit(5)
                .toList();

        return Map.of(
                "courses", courseResults,
                "stocks", stockResults,
                "total", courseResults.size() + stockResults.size(),
                "query", query
        );
    }
}
