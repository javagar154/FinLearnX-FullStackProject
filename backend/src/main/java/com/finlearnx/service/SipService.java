package com.finlearnx.service;

import com.finlearnx.dto.SipRequest;
import com.finlearnx.entity.SipHistory;
import com.finlearnx.entity.User;
import com.finlearnx.repository.SipHistoryRepository;
import com.finlearnx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SipService {

    private final SipHistoryRepository sipHistoryRepository;
    private final UserRepository userRepository;

    public Map<String, Object> calculate(SipRequest request) {
        double monthly = request.getMonthlyAmount();
        double annualRate = request.getAnnualRate();
        int years = request.getDurationYears();

        int n = years * 12;
        double r = annualRate / 100.0 / 12.0;

        double futureValue = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
        double totalInvested = monthly * n;
        double expectedReturns = futureValue - totalInvested;

        Map<String, Object> result = new HashMap<>();
        result.put("monthlyAmount", monthly);
        result.put("annualRate", annualRate);
        result.put("durationYears", years);
        result.put("totalInvested", Math.round(totalInvested * 100.0) / 100.0);
        result.put("expectedReturns", Math.round(expectedReturns * 100.0) / 100.0);
        result.put("futureCorpus", Math.round(futureValue * 100.0) / 100.0);
        result.put("wealthMultiple", Math.round((futureValue / totalInvested) * 100.0) / 100.0);

        // Year-wise breakdown
        Map<Integer, Map<String, Double>> yearlyBreakdown = new HashMap<>();
        for (int y = 1; y <= years; y++) {
            int months = y * 12;
            double fv = monthly * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
            double inv = monthly * months;
            Map<String, Double> yearData = new HashMap<>();
            yearData.put("invested", Math.round(inv * 100.0) / 100.0);
            yearData.put("corpus", Math.round(fv * 100.0) / 100.0);
            yearData.put("gains", Math.round((fv - inv) * 100.0) / 100.0);
            yearlyBreakdown.put(y, yearData);
        }
        result.put("yearlyBreakdown", yearlyBreakdown);

        return result;
    }

    public SipHistory saveCalculation(Long userId, SipRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> result = calculate(request);

        SipHistory history = SipHistory.builder()
                .user(user)
                .monthlyAmount(request.getMonthlyAmount())
                .annualRate(request.getAnnualRate())
                .durationYears(request.getDurationYears())
                .totalInvested((Double) result.get("totalInvested"))
                .expectedReturns((Double) result.get("expectedReturns"))
                .futureCorpus((Double) result.get("futureCorpus"))
                .build();

        return sipHistoryRepository.save(history);
    }

    public List<SipHistory> getHistory(Long userId) {
        return sipHistoryRepository.findByUserIdOrderByCalculatedAtDesc(userId);
    }
}
