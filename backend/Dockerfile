# ---- Build ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q -DskipTests package && cp target/sahel-api-*.jar /src/app.jar

# ---- Exécution ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S kaom && adduser -S kaom -G kaom \
    && mkdir -p /app/uploads && chown -R kaom:kaom /app
COPY --from=build /src/app.jar /app/app.jar
USER kaom
ENV KAOM_UPLOADS_DIR=/app/uploads \
    JAVA_OPTS="-XX:MaxRAMPercentage=75"
VOLUME /app/uploads
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health/readiness | grep -q UP || exit 1
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
