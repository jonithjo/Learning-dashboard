package com.coursetracker.service;

import com.coursetracker.dto.request.CourseRequest;
import com.coursetracker.dto.response.CourseResponse;
import com.coursetracker.exception.ResourceNotFoundException;
import com.coursetracker.model.Course;
import com.coursetracker.model.CourseStatus;
import com.coursetracker.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;

    // ── Create ───────────────────────────────────────────────────────────────

    @Transactional
    public CourseResponse create(CourseRequest request) {
        log.debug("Creating course: {}", request.getTitle());

        Course course = Course.builder()
                .title(request.getTitle())
                .platform(request.getPlatform())
                .url(request.getUrl())
                .status(request.getStatus() != null ? request.getStatus() : CourseStatus.ENROLLED)
                .progressPercent(request.getProgressPercent() != null ? request.getProgressPercent() : 0)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .category(request.getCategory())
                .notes(request.getNotes())
                .build();

        return CourseResponse.from(courseRepository.save(course));
    }

    // ── Read ─────────────────────────────────────────────────────────────────

    public List<CourseResponse> findAll(CourseStatus status, String category, String platform) {
        List<Course> courses;

        if (status != null) {
            courses = courseRepository.findByStatus(status);
        } else if (category != null && !category.isBlank()) {
            courses = courseRepository.findByCategoryIgnoreCase(category);
        } else if (platform != null && !platform.isBlank()) {
            courses = courseRepository.findByPlatformIgnoreCase(platform);
        } else {
            courses = courseRepository.findAll();
        }

        return courses.stream().map(CourseResponse::from).collect(Collectors.toList());
    }

    public CourseResponse findById(Long id) {
        return CourseResponse.from(getCourseOrThrow(id));
    }

    // ── Update ───────────────────────────────────────────────────────────────

    @Transactional
    public CourseResponse update(Long id, CourseRequest request) {
        log.debug("Updating course id={}", id);
        Course course = getCourseOrThrow(id);

        if (request.getTitle() != null)           course.setTitle(request.getTitle());
        if (request.getPlatform() != null)        course.setPlatform(request.getPlatform());
        if (request.getUrl() != null)             course.setUrl(request.getUrl());
        if (request.getStatus() != null)          course.setStatus(request.getStatus());
        if (request.getProgressPercent() != null) course.setProgressPercent(request.getProgressPercent());
        if (request.getStartDate() != null)       course.setStartDate(request.getStartDate());
        if (request.getEndDate() != null)         course.setEndDate(request.getEndDate());
        if (request.getCategory() != null)        course.setCategory(request.getCategory());
        if (request.getNotes() != null)           course.setNotes(request.getNotes());

        return CourseResponse.from(courseRepository.save(course));
    }

    // ── Delete ───────────────────────────────────────────────────────────────

    @Transactional
    public void delete(Long id) {
        log.debug("Deleting course id={}", id);
        getCourseOrThrow(id);   // verify exists before delete
        courseRepository.deleteById(id);
    }

    // ── Stats ────────────────────────────────────────────────────────────────

    public Map<String, Object> getStats() {
        List<Course> all = courseRepository.findAll();

        long enrolled   = all.stream().filter(c -> c.getStatus() == CourseStatus.ENROLLED).count();
        long inProgress = all.stream().filter(c -> c.getStatus() == CourseStatus.IN_PROGRESS).count();
        long completed  = all.stream().filter(c -> c.getStatus() == CourseStatus.COMPLETED).count();

        double avgProgress = all.stream()
                .mapToInt(Course::getProgressPercent)
                .average()
                .orElse(0.0);

        return Map.of(
                "total",       all.size(),
                "enrolled",    enrolled,
                "inProgress",  inProgress,
                "completed",   completed,
                "avgProgress", Math.round(avgProgress * 10.0) / 10.0,
                "categories",  courseRepository.findDistinctCategories(),
                "platforms",   courseRepository.findDistinctPlatforms()
        );
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Course getCourseOrThrow(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }
}
