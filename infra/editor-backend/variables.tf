
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
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ]
}