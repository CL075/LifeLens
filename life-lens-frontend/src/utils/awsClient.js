import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1", // 替换为您的区域
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVA65SERHS", // 替换为您的 Access Key ID
        secretAccessKey: "ya9hLMBqXe2NMpatDViGKxg0u9nGLmHznfrMPMj0", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEP3//////////wEaCXVzLXdlc3QtMiJHMEUCICEhE7UtEUqHGOIuv8dJ3dY7bLDXcIQ5Er6ybSjRiDyqAiEA7QbZq060owMwj/fYc1+FdzI4JUCcIItGCxucNlCVFRAqugII1v//////////ARAAGgw2Nzc3NDI1MTQ5ODYiDIf3LuNy59Y6Y+UMBCqOArJVu4sUD8DRY+rcbJDLmY5LgqD1O0Urhe/extdOvxGsvRCI5jp4vY/Ykey6wBTdT+hc0xVkeNbGm0vkGf1qSvygZeWE5N0u9RxYz7LEnVwiHomjcWWZDHff4OoeXVfIAZozPGUak1fKZxZohA29tMfzSGx9L48ktjmM2dAPSThYKQuEmj2Cb1yLB5owVBvoAQJ2KQCPSHskbPkOExKyh77aLaAlLseHa+18JY6e4igdVeu6tC3OuDkgZ0j3ZbjVxOeD+57aAZNmDbw5XLDNk0jDXFK4r80ecQrH9JlSc8WEcvdkhJdvNpIoymsj+YxaeQ5xu/H3il59mq+pc2nUFthadZA8wPzZHMENPClbRzCMjNq7BjqdAU1VDtjr5tXRHSfBoSytfGnad6AaMY46T3sbz/zeG4O1GOpbpb0aXx2Zoon2ffgVjpO/f7jjHCUa+RQyPWfRuD68wEfp2gTc6N+MxN2XWD+YEfloPKxFaQA8glzbBxQVUApqp8nCBT/If7vtED1JtOsjlQIiWec5Lf8iLRBjjGt246QjEC8oXKEhsjPOwC94DJPZxPkxBgqJuMK72Gg=", // 替换为您的 Session Token
    },
});

export default s3Client;
