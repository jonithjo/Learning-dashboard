package com.coursetracker.dto.request;

import com.coursetracker.model.CourseStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

/**
 * Request DTO for creating or updating a Course.
 * All validation is applied here, keeping the entity clean.
 */
@Data
public class CourseRequest {

    @NotBlank(message = "Course title is required")
    @Size(max = 255, message = "Title must be 255 characters or fewer")
    private String title;

    @Size(max = 100, message = "Platform name must be 100 characters or fewer")
    private String platform;

    @Size(max = 1000, message = "URL must be 1000 characters or fewer")
    private String url;

    private CourseStatus status;

    @Min(value = 0, message = "Progress must be at least 0")
    @Max(value = 100, message = "Progress cannot exceed 100")
    private Integer progressPercent;

    private LocalDate startDate;

    private LocalDate endDate;

    @Size(max = 100, message = "Category must be 100 characters or fewer")
    private String category;

    private String notes;
}
