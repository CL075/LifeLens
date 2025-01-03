import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1", // 替换为您的区域
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVKWX2OQWL", // 替换为您的 Access Key ID
        secretAccessKey: "KE2+BBB+oz4Cg3lx45YoXdrMJaOdzarUhi3TsuhH", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEBMaCXVzLXdlc3QtMiJIMEYCIQD+PaK/0VL9R2MI6XkKdNdGoDWtMTXHjNR6zreXjQnLfAIhAMfjS+SWmc3GBObvueRzJP1UC1jK7GdRGb56vyamaHRiKroCCOz//////////wEQABoMNjc3NzQyNTE0OTg2IgwTVfGsOcjNVnGb1MMqjgKuz6ptQt6TEK+YGyLqBVxkdubM32IwBnnDqjDEOcuFkJQCLVFxddOIDDHrFrODQowh115TDOMqNyPKXg6da84P5GGaXf9Jjt+yQ8RW8kVTDiZdDS4Kwx4+yJI5WREljonO4KD7O8Xknxe6JGFK3fPw0mjBdwMbgSn3xn9lK+CL7NUlYGwch/iqjeLGF2VaQ5Za5N4xdU6NsIwfcn/SUQrUB/ejH05EjDY6yTJSZ15iBr5+bP5N86eUHpIUzTeIJiJFc6j8of0OhLVAF6/ANtBikEkBprS5/g4wKIBveZgP9tj/Daw7isDezXzcNyaZ/aF0trpZXvSMfadF/Lw+HQAmfw2IryQKAIKx1GNtMG4wy4LfuwY6nAGntoYQ6eeFwpkfW/oNW1gAtRAVQ4Vu9VEcqoh1ZlqtzsusrQaHcCtL7UkX3Sp3C0uCdVZgd6fO3lh0SW5Se/1T7k/1aV+hCbXFkfRtYMRl7mwSNpNflDRG9nIaeN7ALrTLctXH4rgz5z+4ckywovEaN9pQs9Q52mJV2GIAfTU2XOTKN8qi6e5RDBeIz+5KK0h64nIy0Z+g+pvqlkk=", // 替换为您的 Session Token
    },
});

export default s3Client;
