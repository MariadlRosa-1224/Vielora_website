data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "ecs_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

resource "aws_iam_role" "ecs_execution" {
  name               = "${var.project_name}-ecs-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_execution_default" {
  role = aws_iam_role.ecs_execution.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "ecs_execution_secrets" {
  statement {
    effect = "Allow"

    actions = [
      "secretsmanager:GetSecretValue"
    ]

    resources = [
      aws_secretsmanager_secret.better_auth.arn,
      aws_secretsmanager_secret.database_url.arn,
      aws_secretsmanager_secret.cognito_client_secret.arn
    ]
  }
}

resource "aws_iam_role_policy" "ecs_execution_secrets" {
  name   = "${var.project_name}-ecs-execution-secrets"
  role   = aws_iam_role.ecs_execution.id
  policy = data.aws_iam_policy_document.ecs_execution_secrets.json
}

resource "aws_iam_role" "ecs_task" {
  name               = "${var.project_name}-ecs-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}

resource "aws_iam_role_policy_attachment" "task_editor_data" {
  role = aws_iam_role.ecs_task.name

  policy_arn = data.terraform_remote_state.editor_backend.outputs.editor_data_policy_arn
}

resource "aws_iam_role_policy_attachment" "task_cognito" {
  role = aws_iam_role.ecs_task.name

  policy_arn = data.terraform_remote_state.editor_backend.outputs.cognito_admin_policy_arn
}

data "aws_iam_policy_document" "task_github_secret" {
  statement {
    effect = "Allow"

    actions = [
      "secretsmanager:GetSecretValue"
    ]

    resources = [
      data.terraform_remote_state.editor_backend.outputs.github_token_secret_arn
    ]
  }
}

resource "aws_iam_role_policy" "task_github_secret" {
  name   = "${var.project_name}-github-secret"
  role   = aws_iam_role.ecs_task.id
  policy = data.aws_iam_policy_document.task_github_secret.json
}