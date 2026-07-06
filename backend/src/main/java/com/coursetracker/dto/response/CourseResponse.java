package com.coursetracker.dto.response;

import com.coursetracker.model.Course;
import com.coursetracker.model.CourseStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO returned by the Course API.
 * Decouples the API contract from the internal entity structure.
 */
@Data
@Builder
public class CourseResponse {

    private Long id;
    private String title;
    private String platform;
    private String url;
    private CourseStatus status;
    private int progressPercent;
    private LocalDate startDate;
    private LocalDate endDate;
    private String category;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Factory method — maps a Course entity to its response DTO.
     */
    public static CourseResponse from(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .platform(course.getPlatform())
                .url(course.getUrl())
                .status(course.getStatus())
                .progressPercent(course.getProgressPercent())
                .startDate(course.getStartDate())
                .endDate(course.getEndDate())
                .category(course.getCategory())
                .notes(course.getNotes())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
