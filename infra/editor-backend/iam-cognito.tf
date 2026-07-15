data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "cognito_admin_permissions" {
  statement {
    effect = "Allow"

    actions = [
      "cognito-idp:ListUsers",
      "cognito-idp:AdminListGroupsForUser",
      "cognito-idp:AdminAddUserToGroup",
      "cognito-idp:AdminRemoveUserFromGroup",
    ]

    resources = [
      "arn:aws:cognito-idp:${var.aws_region}:${data.aws_caller_identity.current.account_id}:userpool/${var.cognito_user_pool_id}"
    ]
  }
}

resource "aws_iam_policy" "cognito_admin_permissions" {
  name   = "vielora-cognito-admin-permissions"
  policy = data.aws_iam_policy_document.cognito_admin_permissions.json
}


resource "aws_iam_role_policy_attachment" "lambda_cognito_admin_permissions" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.cognito_admin_permissions.arn
}