package com.kaom.sahel.web.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.kaom.sahel.domain.RequestStatus;
import com.kaom.sahel.service.RequestService;
import com.kaom.sahel.web.dto.RequestDto;
import com.kaom.sahel.web.dto.StatusInput;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/requests")
public class AdminRequestController {

    private final RequestService service;

    public AdminRequestController(RequestService service) {
        this.service = service;
    }

    @GetMapping
    public List<RequestDto> list(@RequestParam(required = false) RequestStatus status) {
        return service.list(status);
    }

    @PatchMapping("/{id}")
    public RequestDto updateStatus(@PathVariable long id, @Valid @RequestBody StatusInput input) {
        return service.updateStatus(id, input.status());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        service.delete(id);
    }
}
