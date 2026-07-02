# infra/editor-backend/outputs.tf

output "editor_api_url" {
  value = aws_lambda_function_url.entry_writer.function_url
}

output "github_token_secret_name" {
  value = aws_secretsmanager_secret.github_token.name
}

