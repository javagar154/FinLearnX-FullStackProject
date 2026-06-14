package com.finlearnx.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_progress",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user"})
@EqualsAndHashCode(of = "id")
public class CourseProgress {

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
    private Integer progressPercent = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer pagesRead = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean completed = false;

    private Integer quizScore;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime lastAccessedAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
