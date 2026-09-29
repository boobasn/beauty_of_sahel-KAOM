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

import com.kaom.sahel.service.ProductAdminService;
import com.kaom.sahel.web.dto.ProductDto;
import com.kaom.sahel.web.dto.ProductInput;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductAdminService service;

    public AdminProductController(ProductAdminService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProductDto> all() {
        return service.all();
    }

    @GetMapping("/{id}")
    public ProductDto get(@PathVariable long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDto create(@Valid @RequestBody ProductInput input) {
        return service.create(input);
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable long id, @Valid @RequestBody ProductInput input) {
        return service.update(id, input);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        service.delete(id);
    }

    @PostMapping(path = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductDto addImages(@PathVariable long id, @RequestParam("files") List<MultipartFile> files) {
        return service.addImages(id, files);
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ProductDto removeImage(@PathVariable long id, @PathVariable long imageId) {
        return service.removeImage(id, imageId);
    }
}
