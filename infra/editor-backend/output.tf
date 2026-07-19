# infra/editor-backend/outputs.tf

output "editor_api_url" {
  value = aws_lambda_function_url.entry_writer.function_url
}

output "github_token_secret_name" {
  value = aws_secretsmanager_secret.github_token.name
}

output "entries_table_name" {
  value = aws_dynamodb_table.entries.name
}

output "pending_assets_bucket_name" {
  value = aws_s3_bucket.pending_assets.bucket
}

output "editor_data_policy_arn" {
  description = "IAM policy for DynamoDB and pending S3 assets."
  value       = aws_iam_policy.editor_data_permissions.arn
}

output "cognito_admin_policy_arn" {
  description = "IAM policy for Cognito group management."
  value       = aws_iam_policy.cognito_admin_permissions.arn
}

output "github_token_secret_arn" {
  description = "ARN of the GitHub token secret."
  value       = aws_secretsmanager_secret.github_token.arn
}

output "cognito_user_pool_id" {
  value = var.cognito_user_pool_id
}