package com.kaom.sahel.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaom.sahel.domain.CustomerRequest;
import com.kaom.sahel.domain.RequestStatus;

public interface CustomerRequestRepository extends JpaRepository<CustomerRequest, Long> {

    List<CustomerRequest> findAllByOrderByCreatedAtDescIdDesc();

    List<CustomerRequest> findByStatusOrderByCreatedAtDescIdDesc(RequestStatus status);

    long countByStatus(RequestStatus status);

    long countByCreatedAtAfter(Instant since);
}
