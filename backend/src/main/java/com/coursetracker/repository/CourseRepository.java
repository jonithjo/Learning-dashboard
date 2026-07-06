package com.coursetracker.repository;

import com.coursetracker.model.Course;
import com.coursetracker.model.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByStatus(CourseStatus status);

    List<Course> findByCategoryIgnoreCase(String category);

    List<Course> findByPlatformIgnoreCase(String platform);

    @Query("SELECT DISTINCT c.category FROM Course c WHERE c.category IS NOT NULL ORDER BY c.category")
    List<String> findDistinctCategories();

    @Query("SELECT DISTINCT c.platform FROM Course c WHERE c.platform IS NOT NULL ORDER BY c.platform")
    List<String> findDistinctPlatforms();
}
