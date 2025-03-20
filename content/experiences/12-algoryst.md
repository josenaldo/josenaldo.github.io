---
id: 12
title: Senior Software Engineer
company: Algoryst
location: Remote
period: January 2023 - Current
show: true
---

### Client: MedEspecialista

Period: August 2024 - Current

#### Situation

MedEspecialista, an educational platform for medical professionals, needed urgent improvements to enhance system performance, reliability, and maintainability. The existing system, built with Node.js and React, had infrastructure issues, lacked a CI/CD pipeline, has outdated libraries, and required new features to optimize user experience and operational efficiency.

#### Task

As the sole developer, I took full ownership of maintaining and modernizing the platform, addressing infrastructure challenges, implementing new functionalities, and improving system performance. The project required restructuring the Digital Ocean-based infrastructure, setting up a CI/CD pipeline, and developing new features while ensuring stability and scalability.

#### Action

- Reorganized repositories, recovering and structuring them after previous developers left the company.
- Revamped infrastructure, creating new Digital Ocean servers and implementing automated deployment scripts for staging and production.
- Implemented a CI/CD pipeline, streamlining deployments and reducing errors.
- Developed new functionalities, including:
-- A monitoring and follow-up module, enabling tutors to track student progress and send automated email reports. This reduced processing time from one month to a single afternoon, optimizing workload and efficiency.
-- A redesigned flexible study schedule module, replacing a basic pie chart system with an interactive, real-time progress tracker that provides study insights and time tracking.
-- A visual schedule creation tool, allowing students to generate study plans with predefined subject weights, simplifying customization and improving user engagement.
-- Updated and modernized the codebase, migrating legacy JavaScript code to TypeScript, improving type safety, maintainability, and overall system security.
-- Enhanced UX/UI across multiple modules, implementing remote pagination, search functionalities, and a more intuitive admin dashboard.
-- Implemented automated testing with Jest, improving system reliability.

#### Result

- Took over the responsabilities of two full-time developers, handling all necessary tasks - from requirement gathering with stakeholders to deployment - including infrastructure management, backend and frontend development, automated testing, bug fixing, and any other required tasks.
- Reduced system maintenance complexity, cutting deployment time and infrastructure issues significantly.
- Reduced the follow-up process time by 97% by automating processes that previously took four weeks, thereby increasing the tutors' efficiency and saving time and resources.
- Enhanced code quality, improving system scalability, maintainability, and user experience.

### Client: Muvz

Period: November 2023 - April 2024

#### Situation

A major newspaper client needed to modernize its subscription and content management system, which was built using monolithic Java (EJB) services. The system was outdated, difficult to scale, and had high maintenance costs. Additionally, the client wanted to improve front-end performance and transition to a more efficient, event-driven communication system.

Compounding the challenge, the previous development team left the company, leaving only one remaining developer. To rebuild the team, the company assembled a new group of six developers—two mid-level and four junior developers—all of whom specialized in front-end development and had limited experience with Java.

#### Task

As the senior developer, I was responsible for:

- Designing the architecture for new microservices following Clean Architecture, Hexagonal Architecture, SOLID principles, and design patterns, creating a template project used as a foundation for other microservices.
- Migrating legacy monolithic services to a microservices architecture using Java 17, Spring Boot, and Apache Kafka.
- Enhancing the front-end applications to improve usability and performance.
- Introducing event-driven communication to replace some of the existing synchronous REST calls.
- Setting up a Kafka test cluster using Docker Compose, enabling developers to run local tests and providing the DevOps team with a starting point for configuring Kafka in Kubernetes.
- Mentoring the team on modern development practices to improve code quality and team efficiency.

#### Action

- Developed and deployed 5 microservices, leveraging Spring Boot, Spring Security, Spring Data JPA, Spring Cloud OpenFeign, MapStruct, Lombok, and Kafka, enabling better system modularity and reducing interdependencies.
- Refactored the front-end applications, implementing React, Next.js, React Admin, React Hook Form, TanStack Query, and MUI, which significantly improved the user experience and responsiveness.
- Designed and implemented an event-driven architecture using Kafka, replacing synchronous service-to-service communication, improving performance, and reducing system latency.
- Created a centralized back-office system with Spring Boot and React Admin, allowing administrators to manage configurations, users, and subscriptions efficiently.
- Developed an email microservice integrated with Kafka for asynchronous email processing, including logging and auditing capabilities to ensure message traceability.
- Collaborated with DevOps to deploy the system on Kubernetes, creating a robust CI/CD pipeline for automated deployments and system monitoring.
- Led mentorship and training sessions on Hexagonal Architecture, SOLID principles, and DDD, ensuring that the development team could maintain high-quality standards and optimize software development processes.

#### Result

- Successfully modernized the system, transitioning from a monolithic EJB-based application to a microservices architecture, reducing maintenance costs and improving system scalability.
- Improved system performance by over 40%, with faster response times and lower latency.
- Recovered an initial 3-month project delay, ensuring on-time delivery of all planned features.
- Empowered the team with modern software engineering practices, enhancing productivity and collaboration.
