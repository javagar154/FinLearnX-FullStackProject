package com.finlearnx.controller;

import com.finlearnx.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Stock controller provides simulated stock data.
 * In production, integrate with NSE/BSE data providers or Alpha Vantage API.
 */
@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private static final Random RANDOM = new Random();

    // Simulated stock data (subset — full list in frontend)
    private static final List<Map<String, Object>> STOCKS = List.of(
        createStock("RELIANCE", "Reliance Industries", "Energy", "NSE", 2847.50, 1.22),
        createStock("TCS", "Tata Consultancy Services", "IT", "NSE", 3912.75, -0.72),
        createStock("INFY", "Infosys Limited", "IT", "NSE", 1678.40, 1.34),
        createStock("HDFCBANK", "HDFC Bank", "Banking", "NSE", 1589.30, -0.77),
        createStock("AAPL", "Apple Inc.", "Technology", "NASDAQ", 189.84, 1.25),
        createStock("TSLA", "Tesla Inc.", "Auto/EV", "NASDAQ", 248.42, -3.41),
        createStock("AMZN", "Amazon.com Inc.", "E-Commerce", "NASDAQ", 178.25, 1.97),
        createStock("GOOGL", "Alphabet Inc.", "Technology", "NASDAQ", 141.80, 1.37),
        createStock("MSFT", "Microsoft Corporation", "Technology", "NASDAQ", 378.91, 1.52),
        createStock("NVDA", "NVIDIA Corporation", "Semiconductors", "NASDAQ", 875.39, 4.11)
    );

    private static Map<String, Object> createStock(String symbol, String name, String sector,
                                                    String exchange, double price, double changePct) {
        Map<String, Object> stock = new HashMap<>();
        stock.put("symbol", symbol);
        stock.put("name", name);
        stock.put("sector", sector);
        stock.put("exchange", exchange);
        stock.put("price", price);
        stock.put("changePercent", changePct);
        stock.put("change", Math.round(price * changePct / 100 * 100.0) / 100.0);
        return stock;
    }

    @GetMapping("/public/list")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStocks() {
        // Simulate live price fluctuation
        List<Map<String, Object>> liveStocks = STOCKS.stream().map(s -> {
            Map<String, Object> live = new HashMap<>(s);
            double price = (double) s.get("price");
            double fluctuation = (RANDOM.nextDouble() - 0.5) * price * 0.005;
            double newPrice = Math.round((price + fluctuation) * 100.0) / 100.0;
            live.put("price", newPrice);
            return live;
        }).toList();
        return ResponseEntity.ok(ApiResponse.success(liveStocks));
    }

    @GetMapping("/public/{symbol}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStock(@PathVariable String symbol) {
        return STOCKS.stream()
                .filter(s -> s.get("symbol").equals(symbol.toUpperCase()))
                .findFirst()
                .map(s -> ResponseEntity.ok(ApiResponse.success(s)))
                .orElse(ResponseEntity.ok(ApiResponse.error("Stock not found: " + symbol)));
    }

    @GetMapping("/public/{symbol}/history")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPriceHistory(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "30") int days) {

        Optional<Map<String, Object>> stockOpt = STOCKS.stream()
                .filter(s -> s.get("symbol").equals(symbol.toUpperCase()))
                .findFirst();

        if (stockOpt.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Stock not found"));
        }

        double basePrice = (double) stockOpt.get().get("price");
        List<Map<String, Object>> history = generateHistory(basePrice, days);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    private List<Map<String, Object>> generateHistory(double basePrice, int days) {
        List<Map<String, Object>> history = new ArrayList<>();
        double price = basePrice * 0.85;
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_YEAR, -days);

        for (int i = 0; i <= days; i++) {
            double change = (RANDOM.nextDouble() - 0.48) * price * 0.025;
            price = Math.max(price + change, basePrice * 0.5);
            cal.add(Calendar.DAY_OF_YEAR, 1);

            Map<String, Object> point = new HashMap<>();
            point.put("date", String.format("%d-%02d-%02d",
                    cal.get(Calendar.YEAR),
                    cal.get(Calendar.MONTH) + 1,
                    cal.get(Calendar.DAY_OF_MONTH)));
            point.put("price", Math.round(price * 100.0) / 100.0);
            point.put("volume", (long)(RANDOM.nextInt(9000000) + 1000000));
            history.add(point);
        }

        // Ensure last price matches current
        if (!history.isEmpty()) {
            history.get(history.size() - 1).put("price", basePrice);
        }
        return history;
    }
}
