package com.finlearnx.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sip_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user"})
@EqualsAndHashCode(of = "id")
public class SipHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Double monthlyAmount;

    @Column(nullable = false)
    private Double annualRate;

    @Column(nullable = false)
    private Integer durationYears;

    @Column(nullable = false)
    private Double totalInvested;

    @Column(nullable = false)
    private Double expectedReturns;

    @Column(nullable = false)
    private Double futureCorpus;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime calculatedAt = LocalDateTime.now();
}
