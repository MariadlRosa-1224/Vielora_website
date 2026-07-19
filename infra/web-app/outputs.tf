output "route53_name_servers" {
  value = aws_route53_zone.site.name_servers
}

output "site_url" {
  value = "https://${var.domain_name}"
}

output "load_balancer_dns_name" {
  value = aws_lb.web.dns_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.web.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.web.name
}

output "ecs_service_name" {
  value = aws_ecs_service.web.name
}

output "ecs_task_definition_family" {
  value = aws_ecs_task_definition.web.family
}


// Github Actions deployment role outputs
output "github_actions_role_arn" {
  value = aws_iam_role.github_actions_deploy.arn
}


output "github_actions_role_name" {
  description = "GitHub Actions deployment role name"
  value       = aws_iam_role.github_actions_deploy.name
}

output "nat_public_ip" {
  description = "IP de salida que puede permitirse en MongoDB Atlas."
  value       = aws_eip.nat.public_ip
}

output "mongodb_uri_secret_arn" {
  description = "ARN del secreto que contiene MONGODB_URI"
  value       = aws_secretsmanager_secret.database_url.arn
}