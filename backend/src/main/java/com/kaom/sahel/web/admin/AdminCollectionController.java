package com.kaom.sahel.web.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kaom.sahel.service.CollectionAdminService;
import com.kaom.sahel.web.dto.CollectionDto;
import com.kaom.sahel.web.dto.CollectionInput;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/collections")
public class AdminCollectionController {

    private final CollectionAdminService service;

    public AdminCollectionController(CollectionAdminService service) {
        this.service = service;
    }

    @GetMapping
    public List<CollectionDto> all() {
        return service.all();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CollectionDto create(@Valid @RequestBody CollectionInput input) {
        return service.create(input);
    }

    @PutMapping("/{id}")
    public CollectionDto update(@PathVariable long id, @Valid @RequestBody CollectionInput input) {
        return service.update(id, input);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        service.delete(id);
    }

    @PostMapping(path = "/{id}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CollectionDto cover(@PathVariable long id, @RequestParam("file") MultipartFile file) {
        return service.setCover(id, file);
    }
}
