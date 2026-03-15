import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { type S3Client as S3ClientType } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class S3Service {
    private s3: S3ClientType

    constructor(private readonly configService: ConfigService) {
        this.s3 = new S3Client({
            region: 'us-east-1',

            endpoint: this.configService.getOrThrow('MINIO_HOST'),
            forcePathStyle: true,

            credentials: {
                accessKeyId: this.configService.getOrThrow('MINIO_LOGIN'),
                secretAccessKey: this.configService.getOrThrow('MINIO_PASSWORD')
            }
        })
    }

    async upload(
        bucket: string,
        key: string,
        body: Buffer,
        contentType: string
    ) {
        await this.s3.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: contentType
            })
        )

        return key
    }
}
