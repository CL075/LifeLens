import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1", // 替换为您的区域
    credentials: {
        accessKeyId: "ASIA2IJ6WWFGXADDRTMX", // 替换为您的 Access Key ID
        secretAccessKey: "68nOn/QelO16ZnY30WhS1EPh6ovdD8WnNoqccqhN", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEPz//////////wEaCXVzLXdlc3QtMiJHMEUCIQCnonYCP4s+SJTD/Aib153jSuuxG4J07NGhl9CGz8zS3AIgZpH1GlB0aIhsVvKr4ROO2bQrl7SBGH9uGgmlpzo/O0UqugII1f//////////ARACGgw3MDUwNDMwMTgwNjEiDFXizmAmNl1o0hDWLCqOAlBDMluBp7845SsR7xsAs/KRXgLi1YFOXWUcwXEQWURwtHm4/ASnJ9JrG2O5WFUfWLhEF+t3GC5z6Br2/k82T1LveyB0gXGi+XTkQdbzvWoY2TAkPbOgYefENYgmmMIsmlnBgf+ngUf7hCb2P8TU6bx0KzHccw/aZzr/c3yLJspbu+6qDocvunkJSHmKsr75frQHj6/sFR9UPx6mxtb8yL8zbHhGcToVYWTTGrg7eCydTjhTBFyvsUEtDJge582pJ7L10b9dLCqiHIyRhorIkTyQtF1GDGaCkXu2eSFKsxrof7Ccjq7SXEIbETRiNjZBWxdeDa50nahPu4B9QwFfJy7FgzfUcYobgJPZOUTj9zC6hdq7BjqdAVw2PGQQh2DgGJl6FuOISZrEED4i4mZJmYEjV9Jb4aIY8lnJaG9LKO7o6e9H//x3hVPk1tthI6mHhqfBMN9mHlRHgkYXQagQL7KIBs9KjKLXxCJJIot/gzQvXPu1dvRyMql2Khwpa2E8vdQQmG5kIQm0iEfQkqijSee5F6fCP/xePJDogRoXvBSBkDXDEZQdV4NiAezx+sQouFu36Go=", // 替换为您的 Session Token
    },
});

export default s3Client;
