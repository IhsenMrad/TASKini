package com.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @PostMapping("/apply")
    public ResponseEntity<ApplicationEntity> apply(@RequestBody ApplicationEntity application) {
        application.setStatus(ApplicationStatus.PENDING);
        ApplicationEntity savedApplication = applicationRepository.save(application);
        return ResponseEntity.ok(savedApplication);
    }

    @GetMapping("/task/{id}")
    public ResponseEntity<List<ApplicationEntity>> getApplicationsByTask(@PathVariable Long id) {
        List<ApplicationEntity> applications = applicationRepository.findByTaskId(id);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApplicationEntity> acceptApplication(@PathVariable Long id) {
        return applicationRepository.findById(id).map(application -> {
            application.setStatus(ApplicationStatus.ACCEPTED);
            ApplicationEntity updatedApplication = applicationRepository.save(application);
            eventPublisher.publishEvent(new ApplicationStatusChangedEvent(application));
            return ResponseEntity.ok(updatedApplication);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApplicationEntity> rejectApplication(@PathVariable Long id) {
        return applicationRepository.findById(id).map(application -> {
            application.setStatus(ApplicationStatus.REJECTED);
            ApplicationEntity updatedApplication = applicationRepository.save(application);
            eventPublisher.publishEvent(new ApplicationStatusChangedEvent(application));
            return ResponseEntity.ok(updatedApplication);
        }).orElse(ResponseEntity.notFound().build());
    }
}