data "terraform_remote_state" "editor_backend" {
  backend = "s3"

  config = {
    bucket       = "vielora-terraform-state-dev"
    key          = "projects/vielora/editor-backend/terraform.tfstate"
    region       = "us-east-2"
    use_lockfile = true
  }
}