terraform {
  backend "s3" {
    bucket         = "kanyuy-mern-2025"
    key            = "crm-soft/terraform.tfstate"
    region         = "af-south-1"
    use_lockfile   = true
  }
}