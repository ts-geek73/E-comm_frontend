// hooks/useFileUpload.ts
import { useState } from 'react';
import { IImageUrl as UploadedImage  } from '@/types/product';
import { FileUploadResponse } from '@/types/response';
import { toast } from 'react-toastify';


export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFiles = async (files: File[]): Promise<UploadedImage[]> => {
    setIsUploading(true);
    setProgress(0);
    const uploadedImages: UploadedImage[] = [];

    try {
      // Calculate progress increment per file
      const progressIncrement = 100 / files.length;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const uploadFormData = new FormData();
        uploadFormData.append("imagefile", file);
        
        const response = await fetch("/api/uploadFile", {
          method: "POST",
          body: uploadFormData,
        });
        
        const result: FileUploadResponse = await response.json();
        
        if (result.status === 'success' && result.url && result.name) {
          uploadedImages.push({
            url: result.url,
            name: result.name,
          });
        } else {
          toast.error(`Failed to upload image: ${file.name}`);
        }
        
        // Update progress
        setProgress((prevProgress) => 
          Math.min(prevProgress + progressIncrement, 100)
        );
      }
      
      return uploadedImages;
    } catch (error) {
      toast.error('Error uploading files');
      console.error('Upload error:', error);
      return [];
    } finally {
      setIsUploading(false);
      setProgress(100);
    }
  };

  return {
    uploadFiles,
    isUploading,
    progress
  };
};