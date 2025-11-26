# --------------------
# ECS Cluster + Roles
# --------------------
resource "aws_ecs_cluster" "backend" {
  name = "${var.project_name}-cluster"
}

# Reference existing ECS task execution role
data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = data.aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = data.aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "${aws_ecr_repository.backend.repository_url}:latest"
      essential = true
      portMappings = [
        { containerPort = 5001, hostPort = 5001, protocol = "tcp" }
      ]
      environment = [
        { name = "PORT", value = "5001" },
        { name = "EMAIL_USER_NAME", value = "StellarCRM" },
        { name = "EMAIL_HOST", value = "smtp.gmail.com" },
        { name = "EMAIL_PORT", value = "465" },
        { name = "EMAIL_SECURE", value = "true" },
        { name = "EMAIL_USER", value = "hernandezjaoh18@gmail.com" }
      ]
      secrets = [
        {
          name      = "MONGO_URI"
          valueFrom = "${var.secrets_arn}:MONGO_URI::"
        },
        {
          name      = "JWT_SECRET"
          valueFrom = "${var.secrets_arn}:JWT_SECRET::"
        },
        {
          name      = "EMAIL_PASS"
          valueFrom = "${var.secrets_arn}:EMAIL_PASS::"
        },
        {
          name      = "CLOUDINARY_CLOUD_NAME"
          valueFrom = "${var.secrets_arn}:CLOUDINARY_CLOUD_NAME::"
        },
        {
          name      = "CLOUDINARY_API_KEY"
          valueFrom = "${var.secrets_arn}:CLOUDINARY_API_KEY::"
        },
        {
          name      = "CLOUDINARY_API_SECRET"
          valueFrom = "${var.secrets_arn}:CLOUDINARY_API_SECRET::"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}-backend"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

resource "aws_cloudwatch_log_group" "ecs_backend" {
  name              = "/ecs/${var.project_name}-backend"
  retention_in_days = 7
}


resource "aws_ecs_service" "backend" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.backend.id
  task_definition = aws_ecs_task_definition.backend.arn
  enable_execute_command = true
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    assign_public_ip = true
    subnets          = data.aws_subnets.public.ids
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_tg.arn
    container_name   = "backend"
    container_port   = 5001
  }

  health_check_grace_period_seconds = 120
  depends_on = [aws_lb_listener.ecs_listener_https]
}