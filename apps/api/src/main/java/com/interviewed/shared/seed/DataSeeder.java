package com.interviewed.shared.seed;

import com.interviewed.auth.entity.Role;
import com.interviewed.auth.entity.User;
import com.interviewed.auth.repository.UserRepository;
import com.interviewed.profile.entity.CandidateProfile;
import com.interviewed.profile.repository.CandidateProfileRepository;
import com.interviewed.settings.entity.GlobalAiSettings;
import com.interviewed.settings.repository.GlobalAiSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final GlobalAiSettingsRepository globalAiSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        User user = seedUser("user@gmail.com", "User", "user12345", Role.USER);
        seedUser("admin@gmail.com", "Admin", "admin12345", Role.ADMIN);
        seedProfile(user);
        seedGlobalSettings();
    }

    private User seedUser(String email, String name, String password, Role role) {
        return userRepository.findByEmail(email)
            .orElseGet(() -> {
                User saved = userRepository.save(User.builder()
                    .email(email)
                    .name(name)
                    .passwordHash(passwordEncoder.encode(password))
                    .role(role)
                    .build());
                log.info("seed.user email={} role={}", email, role);
                return saved;
            });
    }

    private void seedProfile(User user) {
        if (candidateProfileRepository.findByUserId(user.getId()).isPresent()) {
            return;
        }
        candidateProfileRepository.save(CandidateProfile.builder()
            .userId(user.getId())
            .summary("Java full-stack candidate with Spring Boot and React project experience.")
            .skillsJson("[\"Java\",\"Spring Boot\",\"React\",\"SQL\",\"Docker\"]")
            .experiencesJson("[]")
            .projectsJson("[]")
            .isCompleted(true)
            .build());
        log.info("seed.profile userId={}", user.getId());
    }

    private void seedGlobalSettings() {
        List<GlobalAiSettings> settings = globalAiSettingsRepository.findAll();
        if (settings.isEmpty()) {
            globalAiSettingsRepository.save(GlobalAiSettings.builder()
                .model("openai/gpt-oss-20b:free")
                .temperature(0.4)
                .systemPrompt("You are a professional recruiter conducting a structured interview. This is a simulation to help the candidate prepare.\n\nCandidate Profile:\nSummary: {{SUMMARY}}\nSkills: {{SKILLS}}\n\nYour role:\n- Ask focused, relevant questions about the candidate's experience and skills\n- Be professional and friendly\n- Dig deeper when answers are interesting\n- Conduct 3-8 turns total\n- Write every question in Bahasa Indonesia (formal, professional tone)\n\nIMPORTANT: You must respond ONLY with a JSON object in this exact format:\n{\"question\": \"Pertanyaan Anda di sini\", \"complete\": false}\n\nWhen you have gathered sufficient information (minimum 3 turns), set complete to true:\n{\"question\": \"Terima kasih atas waktu Anda. Saya sudah mendapatkan semua informasi yang diperlukan.\", \"complete\": true}\n\nNever claim hiring authority. Always frame this as a simulation.")
                .build());
            log.info("seed.global.settings");
        } else {
            GlobalAiSettings existing = settings.get(0);
            if (existing.getSystemPrompt() == null || existing.getSystemPrompt().isBlank()) {
                existing.setSystemPrompt("You are a professional recruiter conducting a structured interview. This is a simulation to help the candidate prepare.\n\nCandidate Profile:\nSummary: {{SUMMARY}}\nSkills: {{SKILLS}}\n\nYour role:\n- Ask focused, relevant questions about the candidate's experience and skills\n- Be professional and friendly\n- Dig deeper when answers are interesting\n- Conduct 3-8 turns total\n- Write every question in Bahasa Indonesia (formal, professional tone)\n\nIMPORTANT: You must respond ONLY with a JSON object in this exact format:\n{\"question\": \"Pertanyaan Anda di sini\", \"complete\": false}\n\nWhen you have gathered sufficient information (minimum 3 turns), set complete to true:\n{\"question\": \"Terima kasih atas waktu Anda. Saya sudah mendapatkan semua informasi yang diperlukan.\", \"complete\": true}\n\nNever claim hiring authority. Always frame this as a simulation.");
                globalAiSettingsRepository.save(existing);
                log.info("seed.global.settings.update_prompt");
            }
        }
    }

}
