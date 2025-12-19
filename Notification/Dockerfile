FROM maven:3.9-eclipse-temurin-17-alpine as build
WORKDIR /workspace/app

COPY pom.xml .
COPY Notification/pom.xml Notification/
COPY User/pom.xml User/
COPY Ticket/pom.xml Ticket/
COPY Subscription/pom.xml Subscription/
COPY Route/pom.xml Route/
COPY BusGeolocation/pom.xml BusGeolocation/
COPY api-gateway/pom.xml api-gateway/

RUN mvn dependency:go-offline -B

COPY Notification/src Notification/src
RUN mvn package -pl Notification -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
COPY --from=build /workspace/app/Notification/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
