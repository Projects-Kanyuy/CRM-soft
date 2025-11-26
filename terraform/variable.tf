variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
}
variable "project_name" {
  description = "Name of project"
  type        = string
}
variable "bucket_name" {
  description = "Name of the S3 bucket to host the static website"
  type        = string
}
variable "environment" {
  description = "Deployment environment (prod)"
  type        = string
}
variable "ecr_repository_name" {
  description = "The name of the ECR repository"
  type        = string
}
variable "secrets_arn" {
  description = "Base ARN of the Secrets Manager secret (excluding the key name suffix)"
  type        = string
}
variable "acm_certificate_arn" {
  description = "The ARN of the ACM certificate for CloudFront"
  type        = string
}
variable "custom_domain" {
  description = "The custom domain for CloudFront"
  type        = string
}