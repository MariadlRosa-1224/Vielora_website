resource "aws_cognito_user_group" "admin" {
  user_pool_id = var.cognito_user_pool_id
  name         = "admin"
  description  = "Vielora administrators"
  precedence   = 0
}

resource "aws_cognito_user_group" "moderator" {
  user_pool_id = var.cognito_user_pool_id
  name         = "moderator"
  description  = "Vielora moderators"
  precedence   = 10
}

resource "aws_cognito_user_group" "user" {
  user_pool_id = var.cognito_user_pool_id
  name         = "user"
  description  = "Vielora regular users"
  precedence   = 20
}