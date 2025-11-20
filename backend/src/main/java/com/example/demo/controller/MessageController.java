package com.example.demo.controller;

import com.example.demo.controller.dto.SpamClassificationRequest;
import com.example.demo.models.ClassifiedMessage;
import com.example.demo.models.User;
import com.example.demo.service.MessageService;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;
    private final UserService userService;
    public MessageController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userService.getByEmailOrThrow(email);
    }

    /**
     * Endpoint para enviar y clasificar un mensaje
     */
    @PostMapping("/send-and-classify")
    public ResponseEntity<ClassifiedMessage> sendAndClassify(
            Authentication authentication,
            @RequestBody SpamClassificationRequest req) {

        User authenticatedUser = getAuthenticatedUser(authentication);


        ClassifiedMessage result = messageService.classifyAndSaveMessage(authenticatedUser, req.message);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/classification-history")
    public ResponseEntity<List<ClassifiedMessage>> getClassificationHistory(Authentication authentication) {
        User authenticatedUser = getAuthenticatedUser(authentication);

        List<ClassifiedMessage> history = messageService.getMessagesByUser(authenticatedUser);

        return ResponseEntity.ok(history);
    }
}