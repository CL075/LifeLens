import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1", // 替换为您的区域
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVNQNRP5HF", // 替换为您的 Access Key ID
        secretAccessKey: "lC0L3q6qORD6lJOkiF81Fd5DLqcgt/V3vaaaqJYl", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEFwaCXVzLXdlc3QtMiJGMEQCIDqwzn4NgIKoePIBRcJtYHNe4r4SwDdSjDtx6C0+girdAiB+6X6tIQGe5Z51afpV6SYOiimLql/KZlgOs9jwKGNNvSqxAghFEAAaDDY3Nzc0MjUxNDk4NiIMuLzoQbRhuzTH/qpOKo4CRz5XzR2NIc8Bj5lXEUlp+lNYZ6WITqqLttIdewPMKKKXyh0GyC6/iIY+LsZKPn/OLbxWFIL+sOuLI4KthK/5Bz2lTz9yGIIItggufzlLoWKmYR85RMxcyPIWk9vpVWqBbcxOb0Jo70KsKT2WqGsu0OA9SRszHe9l44xQ3fh93JwIZgbK73rkVH7hpYe/gfODZlI6SUorLzplV2y4B0ivMBL2Svc5b5NGwONdbZkawJtKR41xPB5WZ5izy2DJCSr1xd37bEHz6B0fhukEE5n19MpbdOc5WGhS7BuHTIJghUUnUsWv+OvfNP3ynh1ExuK3DgZjfsGdqsMBrtCWXLvrjE/PUIe2WJ2zdjSYxwWjMNr67rsGOp4BSCPckakT5RzCHs60CZcUychz3zvndK6zKQk0UnexymPPk8eCx8jAa2rU42Z75gdnR41cBvtqOvhRngzP5RITDZN6LJBGG8MoF2hqplLbMqsVGEuhFWk82Kr/bYc/PG755s05Qep5KILzXYvNh/Pifbor6TS8/7X01SRQLSrLsNiyPNd8/Dad1popgGCen0Pyle7PNigm2s6P+2zmvz4=", // 替换为您的 Session Token
    },
});

export default s3Client;
