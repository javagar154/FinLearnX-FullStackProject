package com.finlearnx.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "premium_unlocks",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user"})
@EqualsAndHashCode(of = "id")
public class PremiumUnlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "course_id", nullable = false)
    private String courseId;

    @Column(nullable = false)
    @Builder.Default
    private String paymentStatus = "COMPLETED";

    @Column(nullable = false)
    @Builder.Default
    private Double amountPaid = 100.0;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime unlockedAt = LocalDateTime.now();
}
