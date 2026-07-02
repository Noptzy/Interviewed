package com.interviewed.settings.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_model_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiModelOption {

    @Id
    private String id;

    @Column(nullable = false)
    private String label;
}
