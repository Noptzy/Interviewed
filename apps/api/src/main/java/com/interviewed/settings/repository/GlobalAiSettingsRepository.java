package com.interviewed.settings.repository;

import com.interviewed.settings.entity.GlobalAiSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GlobalAiSettingsRepository extends JpaRepository<GlobalAiSettings, Long> {}
