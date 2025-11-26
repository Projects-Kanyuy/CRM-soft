resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  image_tag_mutability = "MUTABLE"
  force_delete = true
}

resource "aws_ecr_lifecycle_policy" "backend" {
  repository = aws_ecr_repository.backend.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep only last 2 images with the 'latest' tag, delete older ones"
        selection = {
          tagStatus      = "tagged" 
          tagPatternList = ["*"]          # only consider tagged images
          countType      = "imageCountMoreThan"
          countNumber    = 2                   # keep last 2 images
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}