package com.example.demo.repositories;

import com.example.demo.entities.ApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Long> {
    
    // Trouver toutes les applications pour une tâche
    List<ApplicationEntity> findByTaskId(Long taskId);
    
    // Trouver toutes les applications d'un utilisateur
    List<ApplicationEntity> findByApplicantId(Long applicantId);
    
    // Trouver les applications par statut
    List<ApplicationEntity> findByStatus(String status);
    
    // Vérifier si un utilisateur a déjà postulé à une tâche
    @Query("SELECT COUNT(a) > 0 FROM ApplicationEntity a WHERE a.taskId = :taskId AND a.applicantId = :applicantId")
    boolean existsByTaskIdAndApplicantId(@Param("taskId") Long taskId, @Param("applicantId") Long applicantId);
}