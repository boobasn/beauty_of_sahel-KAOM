package com.kaom.sahel;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

class RequestApiTest extends ApiTest {

    @Test
    void computesOrderTotalFromCatalogPrices() throws Exception {
        mvc.perform(post("/api/requests").contentType(MediaType.APPLICATION_JSON).content("""
                        {"type":"ORDER","customerName":"Awa","phone":"+221 77 111 22 33",
                         "items":[{"slug":"robe-tiaya","size":"M","color":"Sable","qty":2}]}
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.total").value(96000))
                .andExpect(jsonPath("$.status").value("NEW"))
                .andExpect(jsonPath("$.items").value("2 × Robe Tiaya, Sable, taille M — 96 000 FCFA"));
    }

    @Test
    void rejectsDraftProductsInOrders() throws Exception {
        mvc.perform(post("/api/requests").contentType(MediaType.APPLICATION_JSON).content("""
                        {"type":"ORDER","customerName":"Awa","phone":"770000000",
                         "items":[{"slug":"boubou-ndiaga","qty":1}]}
                        """))
                .andExpect(status().isNotFound());
    }

    @Test
    void validatesRequiredFields() throws Exception {
        mvc.perform(post("/api/requests").contentType(MediaType.APPLICATION_JSON).content("""
                        {"type":"BESPOKE","customerName":"","phone":""}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.customerName").exists())
                .andExpect(jsonPath("$.errors.phone").exists());
    }

    @Test
    void newsletterIsIdempotent() throws Exception {
        for (int i = 0; i < 2; i++) {
            mvc.perform(post("/api/newsletter").contentType(MediaType.APPLICATION_JSON)
                            .content("{\"email\":\"Fan@Example.com\"}"))
                    .andExpect(status().isNoContent());
        }
    }
}
