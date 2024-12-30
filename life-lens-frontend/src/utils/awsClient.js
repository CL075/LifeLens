import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1", // 替换为您的区域
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVK3734IGM", // 替换为您的 Access Key ID
        secretAccessKey: "As6XoMrjKUHlk4WEEXWwB7gOCUktI0rD0w8bAi7y", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjELP//////////wEaCXVzLXdlc3QtMiJIMEYCIQDfLz6bgdGxKTfOS+Dg5mKmdu0srgPzC4DfBj/zsdqgYAIhAMDho+NwlWRl5ye3sLjNf9nwVuE0glZGVWGQbPCbWvvJKroCCIz//////////wEQABoMNjc3NzQyNTE0OTg2IgyOZ77+Wxz+hjULvYwqjgIkHy+nuSs9j1xoWvHto44/GMiYT57qs0iiaSk1ftGxpz9Th6QpLzrGT72ujVNAlnsqLZ2k2Pr0jzm52BOWwwhSIXF9dokTHS1Rom7hFhZoDLCV9PPsMaXnNi5wSkqxaIHfFuu3Aks12+O+nMWWnLpMpFO51lriETZK2rYGiBJFhTTTxbjQE5ZinLQa6N99MV/mGH0eUN8KnAs1+BrKD/bFbbwN7vP+x/d8tpGKl5ogiOosu9Tkc5mzCtj87MDSMdAs0LbQJzgtg1uOn05bP5Lr2im0elh6f+LZl6JpCpAub1hLcUuCnJBKgk4gdOykXEeaxjNi7u8JAcg7mNhjr7GzL6yBA33E9Me8dccDPVowk/HJuwY6nAEaAbQ+HAKemwYbFXy/yF1mdo37op/3ZTkgLp+LSG6c1vbjX6ka6MZzSCF75zQInhqVwAKW4brUfnTI1WL0DuCOa07O46XNi8occVlIv6CaDPQtk+5XdMl/0xSXLpxecA1qRgr21uZVZfG6WE03Wa3VIf51sfFBfJY+xqibvtA0A6AfGIaMR0hZ3mZIg+OulQnx6HJBzGrHFyMfsH0=", // 替换为您的 Session Token
    },
});

export default s3Client;
