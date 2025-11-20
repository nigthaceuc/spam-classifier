package com.example.demo.service;

import com.example.demo.controller.dto.SpamClassificationResponse;
import com.example.demo.models.ClassifiedMessage;
import com.example.demo.models.User;
import com.example.demo.repository.ClassifiedMessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MessageService {
    private final SpamClassifierService spamClassifierService;
    private final ClassifiedMessageRepository classifiedMessageRepository;

    public MessageService(SpamClassifierService spamClassifierService, ClassifiedMessageRepository classifiedMessageRepository) {
        this.spamClassifierService = spamClassifierService;
        this.classifiedMessageRepository = classifiedMessageRepository;
    }

    public ClassifiedMessage classifyAndSaveMessage(User user, String content) {
        SpamClassificationResponse classification = spamClassifierService.classifyMessage(content);

        ClassifiedMessage message = new ClassifiedMessage(
                user,
                content,
                classification.isSpam(),
                classification.getLabel()
        );
        return classifiedMessageRepository.save(message);
    }

    public List<ClassifiedMessage> getMessagesByUser(User user) {
        return classifiedMessageRepository.findByUser(user);
    }
}