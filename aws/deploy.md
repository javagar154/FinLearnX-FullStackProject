# FinLearnX – AWS Deployment Guide

## Architecture Overview

```
Internet → Route 53 → CloudFront (CDN)
                          ↓
                    S3 (React Frontend)
                          ↓
                    ALB (Load Balancer)
                          ↓
                    ECS Fargate (Spring Boot)
                          ↓
                    RDS PostgreSQL (Multi-AZ)
```

## Services Used

| Service | Purpose |
|---------|---------|
| **S3** | Host React static build |
| **CloudFront** | CDN for frontend |
| **ECS Fargate** | Run Spring Boot containers |
| **ECR** | Docker image registry |
| **RDS PostgreSQL** | Managed database |
| **ALB** | Load balancer for backend |
| **Route 53** | DNS management |
| **ACM** | SSL/TLS certificates |
| **Secrets Manager** | Store JWT secret, DB password |
| **VPC** | Network isolation |

## Step-by-Step Deployment

### 1. Prerequisites
```bash
aws configure  # Set up AWS CLI with your credentials
```

### 2. Create ECR Repository
```bash
aws ecr create-repository --repository-name finlearnx-backend --region ap-south-1
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com
```

### 3. Build & Push Docker Image
```bash
cd backend
docker build -t finlearnx-backend .
docker tag finlearnx-backend:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/finlearnx-backend:latest
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/finlearnx-backend:latest
```

### 4. Create RDS PostgreSQL
```bash
aws rds create-db-instance \
  --db-instance-identifier finlearnx-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password <secure-password> \
  --allocated-storage 20 \
  --db-name finlearnx \
  --vpc-security-group-ids <sg-id> \
  --no-publicly-accessible
```

### 5. Deploy Frontend to S3 + CloudFront
```bash
cd frontend
npm run build

# Create S3 bucket
aws s3 mb s3://finlearnx-frontend-prod

# Upload build
aws s3 sync build/ s3://finlearnx-frontend-prod --delete

# Create CloudFront distribution (via console or CDK)
```

### 6. ECS Task Definition (ecs-task-definition.json)
```json
{
  "family": "finlearnx-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [{
    "name": "finlearnx-backend",
    "image": "<account-id>.dkr.ecr.ap-south-1.amazonaws.com/finlearnx-backend:latest",
    "portMappings": [{"containerPort": 8080}],
    "environment": [
      {"name": "SPRING_DATASOURCE_URL", "value": "jdbc:postgresql://<rds-endpoint>:5432/finlearnx"},
      {"name": "SPRING_DATASOURCE_USERNAME", "value": "postgres"}
    ],
    "secrets": [
      {"name": "SPRING_DATASOURCE_PASSWORD", "valueFrom": "arn:aws:secretsmanager:..."},
      {"name": "JWT_SECRET", "valueFrom": "arn:aws:secretsmanager:..."}
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/finlearnx-backend",
        "awslogs-region": "ap-south-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}
```

### 7. Environment Variables for Production
```
SPRING_DATASOURCE_URL=jdbc:postgresql://<rds-endpoint>:5432/finlearnx
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<from-secrets-manager>
JWT_SECRET=<from-secrets-manager>
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=https://finlearnx.com
```

## Estimated Monthly Cost (AWS Free Tier + Small Scale)
| Service | Cost |
|---------|------|
| ECS Fargate (0.25 vCPU, 0.5GB) | ~$10/month |
| RDS t3.micro | ~$15/month |
| S3 + CloudFront | ~$2/month |
| ALB | ~$18/month |
| **Total** | **~$45/month** |
