# Cloud Migration & Data Warehouse Optimization

## Overview
A strategic initiative to migrate legacy on-premise MySQL databases to AWS cloud infrastructure. Implemented Docker containerization for microservices and optimized data warehouse performance using AWS Redshift and Glue.

## Features
- **Cloud Migration**: Zero-downtime migration to AWS RDS
- **Containerization**: Dockerized application services
- **Data Warehousing**: ETL pipelines to AWS Redshift
- **Cost Optimization**: 35% reduction in operational costs
- **Infrastructure as Code**: Terraform for resource provisioning
- **Monitoring**: CloudWatch dashboards for performance tracking

## Tech Stack
- **Cloud**: AWS (RDS, Redshift, EC2, S3, Glue)
- **DevOps**: Docker, Terraform, Jenkins
- **Database**: MySQL, PostgreSQL
- **Scripting**: Python, Bash

## Project Structure
```
cloud-migration/
├── infrastructure/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── docker/
│       ├── Dockerfile
│       └── docker-compose.yml
├── scripts/
│   ├── migration/
│   │   └── db_sync.py
│   └── optimization/
│       └── vacuum_analyze.sql
├── docs/
│   └── architecture_diagram.png
└── README.md
```

## Migration Strategy

### 1. Assessment & Planning
- Analyzed 500GB+ legacy data
- Mapped dependencies and schema changes
- Selected AWS RDS for OLTP and Redshift for OLAP

### 2. Containerization
- Created Docker images for 5 microservices
- Orchestrated with Docker Compose for local dev
- Deployed to AWS ECS for production

### 3. Data Transfer
- Used AWS DMS (Database Migration Service) for initial load
- Implemented CDC (Change Data Capture) for continuous replication

## Performance Optimization Results

| Metric | Before (On-Prem) | After (AWS) | Improvement |
|--------|------------------|-------------|-------------|
| Query Latency | 2.5s | 0.4s | 84% |
| Uptime | 99.5% | 99.99% | +0.49% |
| Backup Time | 4 hours | 15 mins | 93% |
| Monthly Cost | $1200 | $780 | 35% |

## Code Snippets

### Dockerfile Optimization
```dockerfile
# Multi-stage build for reduced image size
FROM python:3.9-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.9-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "app.py"]
```

## Contact
Built as part of data engineering portfolio demonstrating cloud architecture and DevOps skills.
