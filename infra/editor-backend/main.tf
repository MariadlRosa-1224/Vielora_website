# infra/editor-backend/main.tf

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0, < 7.0"
    }

    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../lambda/editor-entry-writer"
  output_path = "${path.module}/build/editor-entry-writer.zip"
}

resource "aws_secretsmanager_secret" "github_token" {
  name = "${var.project_name}/github-token"
}

resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-entry-writer-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_secrets" {
  name = "${var.project_name}-entry-writer-secrets"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = aws_secretsmanager_secret.github_token.arn
      }
    ]
  })
}

resource "aws_lambda_function" "entry_writer" {
  function_name = "${var.project_name}-entry-writer"
  role          = aws_iam_role.lambda_exec.arn

  runtime = "nodejs22.x"
  handler = "index.handler"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  timeout     = 30
  memory_size = 256

  environment {
    variables = {
      GITHUB_OWNER        = var.github_owner
      GITHUB_REPO         = var.github_repo
      GITHUB_BRANCH       = var.github_branch
      GITHUB_TOKEN_SECRET = aws_secretsmanager_secret.github_token.name
    }
  }
}

resource "aws_lambda_function_url" "entry_writer" {
  function_name      = aws_lambda_function.entry_writer.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_methods     = ["POST"]
    allow_origins     = var.allowed_origins
    allow_headers     = ["content-type"]
    max_age           = 300
  }
}