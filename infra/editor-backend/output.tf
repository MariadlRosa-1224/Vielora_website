# infra/editor-backend/outputs.tf

output "editor_api_url" {
  value = aws_lambda_function_url.entry_writer.function_url
}

output "github_token_secret_name" {
  value = aws_secretsmanager_secret.github_token.name
}

output "bucket_name" {
  value = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}