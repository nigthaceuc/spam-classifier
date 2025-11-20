package com.example.demo.repository;

import com.example.demo.models.ClassifiedMessage;
import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClassifiedMessageRepository extends JpaRepository<ClassifiedMessage, Long> {
    List<ClassifiedMessage> findByUser(User user);
}