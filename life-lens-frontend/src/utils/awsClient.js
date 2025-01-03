import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1", // 替换为您的区域
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVPWKNAVEO", // 替换为您的 Access Key ID
        secretAccessKey: "RxAcxakml7CR3hkiOkYCSyBq5hTlKtgFaTg3w5Zf", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEBcaCXVzLXdlc3QtMiJGMEQCIDtoN508Rs9HkyJde8JE6msziJ8ZVh6QmZ1RHxHikgwVAiBDVZOzhb4v8X9os8FQCFwtldXQXpWKWi+4gONwytg2Ziq6Agjw//////////8BEAAaDDY3Nzc0MjUxNDk4NiIMA02k5Km+CNcXVlxUKo4CCdvj5Af8zFRdbCm02K8cs1d+TuGs/KrAusxNg0l7AHI0AO8EMBAGHBthLnPt8ZAhGkW/5NbAKJAa6xF7X268bBZ4iQasM9YMEbBFRikWagro8QVZj2w6XsMhcEsYY2j8hfomofJymAL4/HQD1/MEluZGCheZ/khc1agydAMTMRdnwnFlV4T3jzTQ2b/BmyrX5jI2UaUwUCKbXWF/sSX+J1DRm6VvjQUWtlR7F52WkR5GRguJxaf73IEvXV7OiFquIhkSi2itkL+h9vfB/8bl76vKet2O6ZHU4Ewv7zP97IlKTBX307Gyflqj/9yyOHZvJrxU5FPgrtN8tVSZSCgcmSVqHYWClBU8rWE0IA0iMO7z37sGOp4BXZzbK/oTD/gTgzyOxC1bk06rt6Jy98lOZievK6gRAqQzz++yXOTZ5ZPAEzvbGkbjxsYusUt/k/geDjPBewhT0u6yfuPMkwB5gt35d/Ytc8mCnEp+Xk37fHEBtYSsU6/bZZN+VljdbW4rZZZH5w9s5GnT0fRSBv4D1xwidzYCtV7Cvxt1fd5sjZAaEdzSEvcyMsxM15lnRLtKW6bcm6E=", // 替换为您的 Session Token
    },
});

export default s3Client;
