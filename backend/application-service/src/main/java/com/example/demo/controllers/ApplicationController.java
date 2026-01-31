package com.example.demo.controllers;

import com.example.demo.entities.ApplicationEntity;
import com.example.demo.repositories.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/applications")
@CrossOrigin("*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    // ===============================================================
    // POST /apply - Postuler à une tâche
    // ===============================================================
    @PostMapping("/apply")
    public ResponseEntity<?> applyToTask(@RequestBody ApplicationEntity application) {
        try {
            // Vérifier si l'utilisateur a déjà postulé
            if (applicationRepository.existsByTaskIdAndApplicantId(
                    application.getTaskId(), application.getApplicantId())) {
                return ResponseEntity.badRequest().body("You have already applied to this task");
            }

            // Créer une nouvelle application
            ApplicationEntity newApplication = new ApplicationEntity(
                    application.getTaskId(),
                    application.getApplicantId(),
                    application.getMessage());

            ApplicationEntity savedApplication = applicationRepository.save(newApplication);
            return ResponseEntity.ok(savedApplication);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error applying to task: " + e.getMessage());
        }
    }

    // ===============================================================
    // GET /applications/task/{id} - Obtenir les applications d'une tâche
    // ===============================================================
    @GetMapping("/task/{taskId}")
    public List<ApplicationEntity> getApplicationsByTask(@PathVariable Long taskId) {
        return applicationRepository.findByTaskId(taskId);
    }

    // ===============================================================
    // GET /applications/user/{userId} - Obtenir les applications d'un utilisateur
    // ===============================================================
    @GetMapping("/user/{userId}")
    public List<ApplicationEntity> getApplicationsByUser(@PathVariable Long userId) {
        return applicationRepository.findByApplicantId(userId);
    }

    // ===============================================================
    // PUT /applications/{id}/accept - Accepter une application
    // ===============================================================
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptApplication(@PathVariable Long id) {
        Optional<ApplicationEntity> applicationOpt = applicationRepository.findById(id);

        if (applicationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ApplicationEntity application = applicationOpt.get();

        // Vérifier si l'application est déjà acceptée
        if ("ACCEPTED".equals(application.getStatus())) {
            return ResponseEntity.badRequest().body("Application already accepted");
        }

        // Accepter l'application
        application.setStatus("ACCEPTED");
        applicationRepository.save(application);

        // Ici, tu pourrais appeler le Task Service pour mettre à jour le statut de la
        // tâche
        // taskService.updateTaskStatus(application.getTaskId(), "IN_PROGRESS");

        return ResponseEntity.ok(application);
    }

    // ===============================================================
    // PUT /applications/{id}/reject - Rejeter une application
    // ===============================================================
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectApplication(@PathVariable Long id) {
        Optional<ApplicationEntity> applicationOpt = applicationRepository.findById(id);

        if (applicationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ApplicationEntity application = applicationOpt.get();

        // Vérifier si l'application est déjà rejetée
        if ("REJECTED".equals(application.getStatus())) {
            return ResponseEntity.badRequest().body("Application already rejected");
        }

        // Rejeter l'application
        application.setStatus("REJECTED");
        applicationRepository.save(application);

        return ResponseEntity.ok(application);
    }

    // ===============================================================
    // GET /applications - Obtenir toutes les applications (pour test)
    // ===============================================================
    @GetMapping
    public List<ApplicationEntity> getAllApplications() {
        return applicationRepository.findAll();
    }
}