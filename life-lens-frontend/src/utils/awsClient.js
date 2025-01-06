import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1", // 替换为您的区域
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVMLVJTRAP", // 替换为您的 Access Key ID
        secretAccessKey: "sCS5HgEuAV9OdNG+DqUjjfc5kIwGw/TDiJs0Nnrv", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIG5GAeCLNkLHev2TH7U+cXJBSxytpNCQgOIStiq+Qsf1AiBp3gGbK1ybx5LO55NH7798U3ytgILZ2h1dxUZkOBx++SqxAgg9EAAaDDY3Nzc0MjUxNDk4NiIMs0NW9d8TSwpbA44HKo4CyWzZfyMpZFB4hgZsbJvlX5ax75awaXD4gHYVFxzz7OZA1sAeQlkGICKXMyqi1jpPfrhjzUm7Y0JIgXUZLBhkeczTjZYdTOF8ElTT68oAIliP7IGjf0URsXPcP0kPnM5D9EIrydkZKzXXkS5sjXGK+/ww3N90Dc1AQxqTy+mn1V+1TziQkr//KPd4uD6EB1NdOe6VHdE35DF0QMti0oZvgl/fifFdP3lAPdrMVPpfrmPJW2v0OT/eg8wq8pQm/lu/03rZqOBQKTOCUexEf6J1/2goEaslGuDe4E9h4zfjXQs5YYNUr+wwOrxW+Exlywp6oY8tMFRlW2wf6qzCQfOD7/I8l2//uEvTLn1875e9MJGx7bsGOp4BdpHjinLAZxn9s8VlTD1LNj+HhoOXGA/tWXvTHbges8m89sjtj3xXVeUoCFwYyI/SMECtm/eCWCX5b5rXt+n6u/5+G/wEKKiYeM8EAodtz/zM0eg3u5xfwtcAyRdKMQ87GuV0Z5dUIfT3UHYFSMdmBzZclF4RwpxSd9ju5h1cYBslw0xzqJYC179xcYrjp4hrbaK421uTV1L2IMdB4MM=", // 替换为您的 Session Token
    },
});

export default s3Client;
