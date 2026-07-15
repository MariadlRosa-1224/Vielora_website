data "aws_iam_policy_document" "editor_data_permissions" {
  statement {
    effect = "Allow"

    actions = [
      "dynamodb:PutItem",
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]

    resources = [
      aws_dynamodb_table.entries.arn,
      "${aws_dynamodb_table.entries.arn}/index/*"
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject"
    ]

    resources = [
      "${aws_s3_bucket.pending_assets.arn}/*"
    ]
  }
}

resource "aws_iam_policy" "editor_data_permissions" {
  name   = "${var.project_name}-editor-data-permissions"
  policy = data.aws_iam_policy_document.editor_data_permissions.json
}

resource "aws_iam_role_policy_attachment" "lambda_editor_data_permissions" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.editor_data_permissions.arn
}