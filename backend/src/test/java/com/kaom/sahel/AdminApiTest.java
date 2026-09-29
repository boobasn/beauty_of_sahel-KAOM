package com.kaom.sahel;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

class AdminApiTest extends ApiTest {

    private static final String PRODUCT = """
            {"name":"Tunique Saly","collection":"fleuve","category":"ENSEMBLES","gender":"FEMME",
             "price":39000,"status":"PUBLISHED","stock":4,"sizes":["S","M"],
             "colors":[{"name":"Indigo","hex":"#27336a"}],"motif":"indigo","tone":"indigo"}
            """;

    @Test
    void rejectsAnonymousAndWrongPassword() throws Exception {
        mvc.perform(get("/api/admin/products")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"creatrice@kaom.test\",\"password\":\"faux\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void productLifecycle() throws Exception {
        String token = adminToken();

        String created = mvc.perform(post("/api/admin/products").header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON).content(PRODUCT))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug").value("tunique-saly"))
                .andExpect(jsonPath("$.colors[0].hex").value("#27336A"))
                .andReturn().getResponse().getContentAsString();
        long id = extractId(created);

        mvc.perform(get("/api/products/tunique-saly")).andExpect(status().isOk());

        mvc.perform(put("/api/admin/products/" + id).header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PRODUCT.replace("39000", "35000").replace("PUBLISHED", "DRAFT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(35000));
        mvc.perform(get("/api/products/tunique-saly")).andExpect(status().isNotFound());

        MockMultipartFile photo = new MockMultipartFile("files", "face.jpg", "image/jpeg", new byte[] {1, 2, 3});
        String withImage = mvc.perform(multipart("/api/admin/products/" + id + "/images").file(photo)
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.images", hasSize(1)))
                .andExpect(jsonPath("$.images[0].url", startsWith("/uploads/products/" + id + "/")))
                .andReturn().getResponse().getContentAsString();
        String url = extract(withImage, "\"url\":\"([^\"]+)\"");
        mvc.perform(get(url)).andExpect(status().isOk());

        MockMultipartFile text = new MockMultipartFile("files", "a.txt", "text/plain", new byte[] {1});
        mvc.perform(multipart("/api/admin/products/" + id + "/images").file(text)
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isBadRequest());

        mvc.perform(delete("/api/admin/products/" + id).header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isNoContent());
    }

    @Test
    void collectionRules() throws Exception {
        String token = adminToken();
        mvc.perform(post("/api/admin/collections").header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Fleuve\",\"published\":true}"))
                .andExpect(status().isConflict());

        String harmattan = mvc.perform(get("/api/admin/collections").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        long id = extractId(harmattan);
        mvc.perform(delete("/api/admin/collections/" + id).header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isConflict());
    }

    @Test
    void requestsCanBeFollowedUp() throws Exception {
        String token = adminToken();
        String created = mvc.perform(post("/api/requests").contentType(MediaType.APPLICATION_JSON).content("""
                        {"type":"BESPOKE","customerName":"Moussa","phone":"770000001","message":"Kaftan mariage"}
                        """))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long id = extractId(created);

        mvc.perform(patch("/api/admin/requests/" + id).header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"CONFIRMED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));

        mvc.perform(get("/api/admin/dashboard").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.collections").value(3));
    }

    private static long extractId(String json) {
        return Long.parseLong(extract(json, "\"id\":(\\d+)"));
    }

    private static String extract(String json, String regex) {
        Matcher m = Pattern.compile(regex).matcher(json);
        if (!m.find()) {
            throw new IllegalStateException(regex + " absent de " + json);
        }
        return m.group(1);
    }
}
