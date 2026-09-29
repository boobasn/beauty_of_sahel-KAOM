package com.kaom.sahel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaom.sahel.domain.AdminUser;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    Optional<AdminUser> findByEmailIgnoreCase(String email);
}
