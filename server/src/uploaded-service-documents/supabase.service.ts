import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '../config/config.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        try {
            const supabaseUrl = this.configService.supabaseUrl;
            const supabaseKey = this.configService.supabaseServiceKey;

            if (!supabaseUrl || !supabaseKey) {
                throw new Error('Supabase URL and Service Key must be configured');
            }

            this.supabase = createClient(supabaseUrl, supabaseKey);

        } catch (error) {
            throw error;
        }
    }

    async uploadFile(
        file: Express.Multer.File,
        folderPath: string = ''
    ): Promise<{ key: string; url: string }> {
        try {
            // Validate file
            if (!file.buffer || file.buffer.length === 0) {
                throw new Error('File buffer is empty');
            }

            // Generate unique file name
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${uuidv4()}.${fileExtension}`;
            const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

            // First, let's test if the bucket exists
            const { data: buckets, error: listError } = await this.supabase.storage.listBuckets();

            if (listError) {
                throw new Error(`Cannot access Supabase storage: ${JSON.stringify(listError)}`);
            }

            const bucketExists = buckets?.some(bucket => bucket.name === this.configService.supabaseBucketName);
            if (!bucketExists) {
                throw new Error(`Bucket '${this.configService.supabaseBucketName}' does not exist. Available buckets: ${buckets?.map(b => b.name).join(', ')}`);
            }

            // Upload file to Supabase storage
            const { data, error } = await this.supabase.storage
                .from(this.configService.supabaseBucketName)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) {
                throw new Error(`Upload failed: ${JSON.stringify(error)}`);
            }

            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from(this.configService.supabaseBucketName)
                .getPublicUrl(filePath);

            return {
                key: filePath,
                url: urlData.publicUrl
            };
        } catch (error) {
            throw new Error(`File upload failed: ${error.message}`);
        }
    }

    async deleteFile(key: string): Promise<boolean> {
        try {
            const { error } = await this.supabase.storage
                .from(this.configService.supabaseBucketName)
                .remove([key]);

            if (error) {
                throw new Error(`Delete failed: ${error.message}`);
            }

            return true;
        } catch (error) {
            throw new Error(`File deletion failed: ${error.message}`);
        }
    }

    async getFileUrl(key: string): Promise<string> {
        try {
            const { data } = this.supabase.storage
                .from(this.configService.supabaseBucketName)
                .getPublicUrl(key);

            return data.publicUrl;
        } catch (error) {
            throw new Error(`Get file URL failed: ${error.message}`);
        }
    }

    async downloadFile(key: string): Promise<{ data: Blob; contentType: string }> {
        try {
            const { data, error } = await this.supabase.storage
                .from(this.configService.supabaseBucketName)
                .download(key);

            if (error) {
                throw new Error(`Download failed: ${error.message}`);
            }

            return {
                data,
                contentType: data.type
            };
        } catch (error) {
            throw new Error(`File download failed: ${error.message}`);
        }
    }
}
