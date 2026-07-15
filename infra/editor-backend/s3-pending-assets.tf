locals {
  safe_project_name = lower(replace(var.project_name, "_", "-"))
}

resource "aws_s3_bucket" "pending_assets" {
  bucket = "${local.safe_project_name}-pending-assets-${data.aws_caller_identity.current.account_id}"

  tags = {
    Project = var.project_name
  }
}

resource "aws_s3_bucket_public_access_block" "pending_assets" {
  bucket = aws_s3_bucket.pending_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "pending_assets" {
  bucket = aws_s3_bucket.pending_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "pending_assets" {
  bucket = aws_s3_bucket.pending_assets.id

  versioning_configuration {
    status = "Enabled"
  }
}