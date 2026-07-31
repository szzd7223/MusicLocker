# Stage 1: Build the Maven application
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first to utilize Docker layer cache
RUN mvn dependency:go-offline
COPY src ./src
# Compile and package jar, skipping tests
RUN mvn clean package -DskipTests

# Stage 2: Create execution runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/music-catalog-api-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
