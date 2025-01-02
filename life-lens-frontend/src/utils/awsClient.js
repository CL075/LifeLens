import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1", // 替换为您的区域
    credentials: {
        accessKeyId: "ASIA2IJ6WWFG7PMBASBS", // 替换为您的 Access Key ID
        secretAccessKey: "xec3rPnlEs0Whlk5/zp3b5hXVwaQHZq1q1qVkwnI", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEPj//////////wEaCXVzLXdlc3QtMiJHMEUCIHNaN+5iZtht6NbwcaSiXHGTfeX/z01IFxn4aB6eMGebAiEAmXYBiuZPcxhzgj6iEObrMVAa35a6etK54ehVsvfvr+EqugII0f//////////ARACGgw3MDUwNDMwMTgwNjEiDPx4xfAufN/U6ZSe9SqOAiteKYfRhZ6WaiFTnPtvR9i5obzLiCVBRAK0H/9KyjB4wAXEUmaJQuHvGeHf1UY9IPgSKRuyFKOgNL3gdv09/uE4CAmbAXqjioeubVLm9JB0+/iHaF5tyOtChWNZ7o/BAHVHebiS5nCTPYk9yHk7+nYCjjntayTRYNggPfYewknEfu9m7VLYZ9vO61Y+qhwC954weCNMK9ncmvcbwNvbPftESLHT+jZg26Dsf26jGh48I1MBBtS31qBYkQ4zqkQmCW6uzrNkcM2yUVrraIhZQ/sMMeL9vz/qCoPSSwi4yKxp3IMAqzb9Sk87IJK5OMzzKx9KnuhNx7q1z7AB4ZxmZt2JUchLqk+ydKHRK/is4DChj9m7BjqdASjlnWpfcuZFo3rmZWTTBjNsNDdpXEvek5AlY6nKkzW9V/CshKdf9/NW0/acGtDZFWiRqGet7v7gsRsi3L5A22UbbbeOMmarcaPLASXYHRkWF5NSLLEi+6/LEI4prILQZRG3LErygb/IK75oZqXInlKUnju096QUHXoYflceYoTq9gOHSE3S0ckpJLesocJqnMocH3cOAnKRq+Fcj/s=", // 替换为您的 Session Token
    },
});

export default s3Client;
