variable "aws_region" {
  description = "AWS region for the S3 bucket"
  type        = string
  default     = "us-east-2"
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name for the website"
  type        = string

}

