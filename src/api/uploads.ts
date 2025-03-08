/**
 * Uploads API
 * 
 * This file contains API calls related to file uploads.
 */

import { fileApi, handleApiError } from './config';
import { FileUploadResponse } from '../types/api';

/**
 * Upload multiple files to the server
 * 
 * @param files - Array of files to upload
 * @param isPublic - Whether the files should be publicly accessible
 * @returns Array of file upload responses with URLs
 */
export const uploadFiles = async (files: File[], isPublic: boolean = false): Promise<FileUploadResponse[]> => {
  try {
    // Prepare FormData with files
    const formData = new FormData();
    
    // Append each file to the form data
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Add the isPublic flag
    formData.append('isPublic', String(isPublic));
    
    // Execute the upload
    const response = await fileApi.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.files;
  } catch (error: any) {
    return handleApiError(error, 'Failed to upload files');
  }
}; 