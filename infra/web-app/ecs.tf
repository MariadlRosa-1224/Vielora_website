
// 
resource "aws_ecs_cluster" "web" {
  name = "${var.project_name}-cluster"
}

resource "aws_ecs_task_definition" "web" {
  family                   = "${var.project_name}-web"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  cpu    = var.task_cpu
  memory = var.task_memory

  execution_role_arn = aws_iam_role.ecs_execution.arn
  task_role_arn      = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "web"
      image     = "${aws_ecr_repository.web.repository_url}:${var.image_tag}"
      essential = true

      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "MONGODB_DB_NAME"
          value = "vielora-entries"
        },
        {
          name  = "SITE_ORIGIN"
          value = "https://${var.domain_name}"
        },
        {
          name  = "PORT"
          value = tostring(var.container_port)
        },
        {
          name  = "HOSTNAME"
          value = "0.0.0.0"
        },
        {
          name  = "AWS_REGION"
          value = var.aws_region
        },
        {
          name  = "BETTER_AUTH_URL"
          value = "https://${var.domain_name}"
        },
        {
          name  = "COGNITO_USER_POOL_ID"
          value = data.terraform_remote_state.editor_backend.outputs.cognito_user_pool_id
        },
        {
          name  = "COGNITO_CLIENT_ID"
          value = var.cognito_client_id
        },
        {
          name  = "COGNITO_ISSUER"
          value = "https://cognito-idp.${var.aws_region}.amazonaws.com/${data.terraform_remote_state.editor_backend.outputs.cognito_user_pool_id}"
        },
        {
          name  = "VIELORA_ENTRIES_TABLE_NAME"
          value = data.terraform_remote_state.editor_backend.outputs.entries_table_name
        },
        {
          name  = "VIELORA_PENDING_ASSETS_BUCKET"
          value = data.terraform_remote_state.editor_backend.outputs.pending_assets_bucket_name
        },
        {
          name  = "GITHUB_OWNER"
          value = var.github_owner
        },
        {
          name  = "GITHUB_REPO"
          value = var.github_repo
        },
        {
          name  = "GITHUB_BRANCH"
          value = var.github_branch
        },
        {
          name  = "GITHUB_TOKEN_SECRET_ID"
          value = data.terraform_remote_state.editor_backend.outputs.github_token_secret_name
        },
        {
          name  = "COGNITO_DOMAIN"
          value = "us-east-22c6npwy4d.auth.us-east-2.amazoncognito.com"
        },
      ]

      secrets = [
        {
          name      = "BETTER_AUTH_SECRET"
          valueFrom = aws_secretsmanager_secret.better_auth.arn
        },
        {
          name      = "MONGODB_URI"
          valueFrom = aws_secretsmanager_secret.database_url.arn
        },
        {
          name      = "COGNITO_CLIENT_SECRET"
          valueFrom = aws_secretsmanager_secret.cognito_client_secret.arn
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"

        options = {
          awslogs-group         = aws_cloudwatch_log_group.web.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "web"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "web" {
  name            = "${var.project_name}-web"
  cluster         = aws_ecs_cluster.web.id
  task_definition = aws_ecs_task_definition.web.arn

  launch_type   = "FARGATE"
  desired_count = var.desired_count

  health_check_grace_period_seconds = 60

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets = aws_subnet.private[*].id

    security_groups = [
      aws_security_group.ecs.id
    ]

    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.web.arn
    container_name   = "web"
    container_port   = var.container_port
  }

  depends_on = [
    aws_lb_listener.https
  ]

  lifecycle {
    ignore_changes = [
      desired_count,
      task_definition,
    ]
  }
}
