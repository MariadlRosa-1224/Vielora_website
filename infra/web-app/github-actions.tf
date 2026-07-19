data "aws_iam_openid_connect_provider" "github_actions" {
  arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
}

locals {
  github_oidc_subjects = [
    # Formato tradicional.
    "repo:${var.github_owner}/${var.github_repo}:ref:refs/heads/${var.github_branch}",

    # Formato inmutable nuevo.
    "repo:${var.github_owner}@${var.github_owner_id}/${var.github_repo}@${var.github_repo_id}:ref:refs/heads/${var.github_branch}",
  ]
}

resource "aws_iam_role" "github_actions_deploy" {
  name = "${var.project_name}-github-actions-deploy"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "GitHubActionsOIDC"
        Effect = "Allow"

        Principal = {
          Federated = data.aws_iam_openid_connect_provider.github_actions.arn
        }

        Action = "sts:AssumeRoleWithWebIdentity"

        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
            "token.actions.githubusercontent.com:sub" = local.github_oidc_subjects
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-github-actions-deploy"
    Environment = "production"
  }
}


// The following policy allows GitHub Actions to deploy to ECS and ECR.
resource "aws_iam_role_policy" "github_actions_deploy" {
  name = "${var.project_name}-github-actions-deploy"
  role = aws_iam_role.github_actions_deploy.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "GetECRAuthorizationToken"
        Effect = "Allow"

        Action = [
          "ecr:GetAuthorizationToken",
        ]

        Resource = "*"
      },
      {
        Sid    = "PushImageToECR"
        Effect = "Allow"

        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage",
        ]

        Resource = aws_ecr_repository.web.arn
      },
      {
        Sid    = "RegisterTaskDefinition"
        Effect = "Allow"

        Action = [
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition",
        ]

        Resource = "*"
      },
      {
        Sid    = "DeployToECSService"
        Effect = "Allow"

        Action = [
          "ecs:DescribeServices",
          "ecs:UpdateService",
        ]

        Resource = aws_ecs_service.web.id
      },
      {
        Sid    = "PassECSTaskRoles"
        Effect = "Allow"

        Action = [
          "iam:PassRole",
        ]

        Resource = [
          aws_iam_role.ecs_execution.arn,
          aws_iam_role.ecs_task.arn,
        ]

        Condition = {
          StringEquals = {
            "iam:PassedToService" = "ecs-tasks.amazonaws.com"
          }
        }
      }
    ]
  })
}