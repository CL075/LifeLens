import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1", // 替换为您的区域
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVNQ66I4QM", // 替换为您的 Access Key ID
        secretAccessKey: "S/naHfcgD1M0vgr4M3EoaSwHmEmmv1w5LSd+wkgh", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIQCsDMbBx4ZfJ71pPMisZYmjydjCbSZUdLriPtxLs7j7RAIgZPuTpiXwh6udFATmYs+v2mXDsPln56iYoOCPUej21qYqsQIIQRAAGgw2Nzc3NDI1MTQ5ODYiDOH4kjQH4zKv6qSP8CqOApgxVeRGKAVBtp/odolUiTMnhKR5pr0WfBsUQzwyctN20+eSEG8qgD0AwJDJfgDSFYrhdQxE/zev+/nYgYmqW7QlS9e9fRkTfpxmhWZBaM4x/fLJ0cZEA4SkkanlQDsd9/mcmG7jjKLlsJQ//RYd6CqZtwX1P27y1KmqBSQ8JAz8ZaV3efWtYMrNiOOW4l3BuHB0qMor+UEua6NYd4EZlc2x3OhL7QjzocO7s0xkrUNo2N3nK2j667ohUs1eH1Qcsu6qsIh5HZAl1dvJhKCU0BNVlqYbTr0X29OS0NxktzGsHji4X4lxfCnquVjWTMLXYlVp0s7G085gFeexMqtadnAoZjr2ro9sWRD2DwoUoTC+pO67BjqdAQG7r2xRlIdPS5Khg3SXEV+QNOpTjZ4XeB8r7XA5vTZaEIRGf8sjB0Aw18+DEmwIjcf0e8YW17B0g801B1sY+hkHULPJ3+Voe0d1e60QmqnWv9S8lmVvJ6gSAB1xPmIZUfw1oPtXyJSz97FC9jmK/NIAVgKRxB7YrwV2EaAQdTHlxtQz1s/gHBFRceeaedLmThFk19FfwqY9++bCdBw=", // 替换为您的 Session Token
    },
});

export default s3Client;
