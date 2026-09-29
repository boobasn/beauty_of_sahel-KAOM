package com.kaom.sahel.service;

import java.text.NumberFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.kaom.sahel.domain.CustomerRequest;
import com.kaom.sahel.domain.Product;
import com.kaom.sahel.domain.ProductStatus;
import com.kaom.sahel.domain.RequestStatus;
import com.kaom.sahel.domain.RequestType;
import com.kaom.sahel.repository.CustomerRequestRepository;
import com.kaom.sahel.repository.ProductRepository;
import com.kaom.sahel.web.dto.RequestDto;
import com.kaom.sahel.web.dto.RequestInput;

@Service
@Transactional
public class RequestService {

    private final CustomerRequestRepository requests;
    private final ProductRepository products;

    public RequestService(CustomerRequestRepository requests, ProductRepository products) {
        this.requests = requests;
        this.products = products;
    }

    public RequestDto create(RequestInput input) {
        CustomerRequest r = new CustomerRequest();
        r.setType(input.type());
        r.setCustomerName(input.customerName().trim());
        r.setPhone(input.phone().trim());
        r.setEmail(StringUtils.hasText(input.email()) ? input.email().trim() : null);
        r.setMessage(input.message());

        if (input.type() == RequestType.ORDER) {
            if (input.items() == null || input.items().isEmpty()) {
                throw new IllegalArgumentException("Le panier est vide");
            }
            List<String> lines = new ArrayList<>();
            int total = 0;
            for (RequestInput.Item item : input.items()) {
                Product p = products.findBySlug(item.slug())
                        .filter(x -> x.getStatus() == ProductStatus.PUBLISHED)
                        .orElseThrow(() -> new NotFoundException("Article indisponible : " + item.slug()));
                int lineTotal = p.getPrice() * item.qty();
                total += lineTotal;
                lines.add("%d × %s%s%s — %s".formatted(item.qty(), p.getName(),
                        StringUtils.hasText(item.color()) ? ", " + item.color() : "",
                        StringUtils.hasText(item.size()) ? ", taille " + item.size() : "",
                        fcfa(lineTotal)));
            }
            r.setItems(String.join("\n", lines));
            r.setTotal(total);
        }
        return RequestDto.from(requests.save(r));
    }

    @Transactional(readOnly = true)
    public List<RequestDto> list(RequestStatus status) {
        var list = status == null ? requests.findAllByOrderByCreatedAtDescIdDesc()
                : requests.findByStatusOrderByCreatedAtDescIdDesc(status);
        return list.stream().map(RequestDto::from).toList();
    }

    public RequestDto updateStatus(long id, RequestStatus status) {
        CustomerRequest r = requests.findById(id).orElseThrow(() -> new NotFoundException("Demande introuvable"));
        r.setStatus(status);
        return RequestDto.from(r);
    }

    public void delete(long id) {
        requests.delete(requests.findById(id).orElseThrow(() -> new NotFoundException("Demande introuvable")));
    }

    @Transactional(readOnly = true)
    public long countNew() {
        return requests.countByStatus(RequestStatus.NEW);
    }

    @Transactional(readOnly = true)
    public long countSince(int days) {
        return requests.countByCreatedAtAfter(Instant.now().minus(days, ChronoUnit.DAYS));
    }

    static String fcfa(int amount) {
        return NumberFormat.getIntegerInstance(Locale.FRANCE).format(amount).replace(' ', ' ').replace(' ', ' ') + " FCFA";
    }
}
