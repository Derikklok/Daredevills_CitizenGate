# Troubleshooting File Upload Issues

## Common Error: "Unexpected token '<', "<?xml vers"... is not valid JSON"

This error typically occurs when Supabase returns an XML error response instead of JSON, indicating a configuration or authentication issue.

### 1. Check Environment Variables

Ensure these environment variables are properly set in your `.env` file:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_BUCKET_NAME=your-bucket-name
```

#### How to find these values:

1. **SUPABASE_URL**: Go to your Supabase project dashboard → Settings → API → Project URL
2. **SUPABASE_SERVICE_KEY**: Go to your Supabase project dashboard → Settings → API → service_role key (NOT anon key)
3. **SUPABASE_BUCKET_NAME**: Go to Storage section and note your bucket name

### 2. Verify Bucket Configuration

1. Go to your Supabase project dashboard
2. Navigate to Storage section
3. Ensure your bucket exists and has the correct name
4. Check bucket policies - the service role should have upload permissions

### 3. Test Supabase Configuration

You can test your configuration by calling the health endpoint:

```bash
GET /api/uploaded-service-documents/health
```

### 4. Bucket Policies

Your bucket should have a policy that allows the service role to upload files. Example policy:

```sql
-- Allow service role to upload files
CREATE POLICY "Service role can upload files" ON storage.objects FOR INSERT
TO service_role WITH CHECK (true);

-- Allow service role to read files
CREATE POLICY "Service role can read files" ON storage.objects FOR SELECT
TO service_role USING (true);

-- Allow service role to delete files
CREATE POLICY "Service role can delete files" ON storage.objects FOR DELETE
TO service_role USING (true);
```

### 5. Common Issues and Solutions

#### Issue: "Bucket not found"

- **Solution**: Create the bucket in Supabase Storage or update the `SUPABASE_BUCKET_NAME` environment variable

#### Issue: "Access denied" or "Insufficient permissions"

- **Solution**: Check that you're using the `service_role` key, not the `anon` key
- **Solution**: Verify bucket policies allow the service role to upload

#### Issue: "Invalid JWT"

- **Solution**: Ensure the `SUPABASE_SERVICE_KEY` is correctly copied (it's a long string starting with `eyJ...`)

#### Issue: "File upload failed: File buffer is empty"

- **Solution**: This indicates the file didn't reach the server properly. Check your frontend form data implementation

### 6. Debugging Steps

1. **Check server logs** for detailed error messages
2. **Verify environment variables** are loaded correctly
3. **Test Supabase connection** using the health endpoint
4. **Check bucket permissions** in Supabase dashboard
5. **Verify file format** - ensure the file is not corrupted

### 7. Testing with curl

You can test the upload endpoint directly with curl:

```bash
curl -X POST \
  http://localhost:3000/api/uploaded-service-documents/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/test.pdf" \
  -F "serviceId=your-service-uuid" \
  -F "requiredDocumentId=your-document-uuid" \
  -F "appointmentId=your-appointment-uuid"
```

### 8. Enable Debug Logging

The service now includes detailed logging. Check your server console for:

- File upload initialization logs
- Supabase configuration details
- Upload progress and results
- Error details

If you're still experiencing issues after following these steps, please check the server logs for specific error messages and verify your Supabase project configuration.
