
variable "aws_region" {
  type    = string
  default = "us-east-2"
}

variable "project_name" {
  type    = string
  default = "vielora"
}

variable "github_owner" {
  type = string
}

variable "github_repo" {
  type = string
}

variable "github_branch" {
  type    = string
  default = "main"
}



variable "domain_name" {
  description = "Domain used for the site."
  type        = string
}

variable "environment" {
  type    = string
  default = "production"
}







variable "cognito_client_id" {
  type = string
}

variable "container_port" {
  type    = number
  default = 3000
}

variable "task_cpu" {
  type    = number
  default = 512
}

variable "task_memory" {
  type    = number
  default = 1024
}

variable "desired_count" {
  description = "Número de contenedores ejecutándose."
  type        = number
  default     = 1
}

variable "bootstrap_image_tag" {
  type    = string
  default = "bootstrap"
}

variable "vpc_cidr" {
  type    = string
  default = "10.40.0.0/16"
}

variable "image_tag" {
  description = "ECR image tag used by ECS"
  type        = string
}

variable "github_owner_id" {
  description = "Numeric GitHub owner ID"
  type        = string
}


variable "github_repo_id" {
  description = "Numeric GitHub repository ID"
  type        = string
}
