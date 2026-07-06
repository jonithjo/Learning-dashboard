package com.coursetracker.controller;

import com.coursetracker.dto.request.CourseRequest;
import com.coursetracker.dto.response.CourseResponse;
import com.coursetracker.model.CourseStatus;
import com.coursetracker.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for course management.
 *
 *  POST   /api/courses              — create course
 *  GET    /api/courses              — list all (optional filters: status, category, platform)
 *  GET    /api/courses/stats        — aggregated stats
 *  GET    /api/courses/{id}         — get by id
 *  PUT    /api/courses/{id}         — update (partial)
 *  DELETE /api/courses/{id}         — delete
 */
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // ── POST /api/courses ────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<CourseResponse> create(@Valid @RequestBody CourseRequest request) {
        CourseResponse created = courseService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── GET /api/courses ─────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAll(
            @RequestParam(required = false) CourseStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String platform
    ) {
        return ResponseEntity.ok(courseService.findAll(status, category, platform));
    }

    // ── GET /api/courses/stats ───────────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(courseService.getStats());
    }

    // ── GET /api/courses/{id} ────────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.findById(id));
    }

    // ── PUT /api/courses/{id} ────────────────────────────────────────────────

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request
    ) {
        return ResponseEntity.ok(courseService.update(id, request));
    }

    // ── DELETE /api/courses/{id} ─────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
