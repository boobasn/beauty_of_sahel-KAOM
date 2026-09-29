package com.kaom.sahel;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

class CatalogApiTest extends ApiTest {

    @Test
    void listsPublishedCollections() throws Exception {
        mvc.perform(get("/api/collections"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].slug").value("harmattan"))
                .andExpect(jsonPath("$[0].featured").value(true));
    }

    @Test
    void hidesDraftProducts() throws Exception {
        mvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].slug", hasItem("robe-tiaya")))
                .andExpect(jsonPath("$[*].slug", not(hasItem("boubou-ndiaga"))));
        mvc.perform(get("/api/products/boubou-ndiaga")).andExpect(status().isNotFound());
    }

    @Test
    void filtersByCollectionAndCategory() throws Exception {
        mvc.perform(get("/api/products").param("collection", "fleuve").param("category", "ROBES"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].collection", not(hasItem("harmattan"))))
                .andExpect(jsonPath("$[*].category", not(hasItem("ACCESSOIRES"))));
    }

    @Test
    void returnsProductDetails() throws Exception {
        mvc.perform(get("/api/products/grand-boubou-laterite"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(95000))
                .andExpect(jsonPath("$.collectionName").value("Harmattan"))
                .andExpect(jsonPath("$.sizes", hasSize(5)))
                .andExpect(jsonPath("$.colors[0].name").value("Latérite"));
    }

    @Test
    void exposesShopSettings() throws Exception {
        mvc.perform(get("/api/settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.freeShippingThreshold").value(50000));
    }
}
