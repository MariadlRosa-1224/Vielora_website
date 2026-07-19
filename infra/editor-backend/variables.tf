
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

variable "allowed_origins" {
  type = list(string)

  default = [
    "https://ghosts-box.com",
    "https://www.ghosts-box.com",
  ]
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID used for Vielora authentication."
  type        = string
}