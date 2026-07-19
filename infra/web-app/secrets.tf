resource "aws_secretsmanager_secret" "better_auth" {
  name = "${var.project_name}/production/better-auth-secret"
}

resource "aws_secretsmanager_secret" "database_url" {
  name = "${var.project_name}/production/database-url"
}

resource "aws_secretsmanager_secret" "cognito_client_secret" {
  name = "${var.project_name}/production/cognito-client-secret"
}