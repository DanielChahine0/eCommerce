```mermaid
flowchart LR

U[User Browser] --> FE[React SPA Frontend]

FE -->|REST JSON + JWT| CTRL[Spring Boot Controllers]

subgraph BACKEND[Spring Boot Application Tier]
    CTRL --> SVC[Service Layer]
    SVC --> REPO[Repository Layer]
end

REPO --> DB[(PostgreSQL Database)]

CTRL -->|DTO Responses| FE
FE -->|DTO Requests| CTRL

```