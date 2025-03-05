import React from 'react';

interface FileUploadFieldProps {
  fieldName: string;
  label: string;
  required?: boolean;
  value: FileList | null;
  onChange: (files: FileList | null) => void;
  accept?: string;
  maxSize?: number; // in MB
}

/**
 * A reusable file upload field component with drag and drop support
 */
export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  fieldName,
  label,
  required = false,
  value,
  onChange,
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSize = 10 // Default 10MB
}) => {
  const inputId = fieldName + "Input";
  const isFileSelected = value && value.length > 0;
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500");
    const files = e.dataTransfer.files;
    
    if (files.length > 0) {
      // Check file size
      if (files[0].size > maxSize * 1024 * 1024) {
        alert(`File size exceeds ${maxSize}MB limit`);
        return;
      }
      onChange(files);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Check file size
      if (files[0].size > maxSize * 1024 * 1024) {
        alert(`File size exceeds ${maxSize}MB limit`);
        return;
      }
      onChange(files);
    }
  };
  
  return (
    <div className="relative">
      <label className="block mb-2 font-medium text-sky-950">
        {label} {required && "*"}
      </label>

      {/* If NO file is selected, show drag-and-drop */}
      {!isFileSelected && (
        <div
          className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center justify-center bg-gray-50"
          onClick={() => document.getElementById(inputId)?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-blue-500");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-blue-500");
          }}
          onDrop={handleDrop}
        >
          <svg
            className="w-8 h-8 mb-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6
                a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PDF, PNG, JPG or JPEG (MAX. {maxSize}MB)
          </p>
          <input
            id={inputId}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept={accept}
            required={required}
          />
        </div>
      )}

      {/* If a file IS selected, show file name + remove button */}
      {isFileSelected && (
        <div className="flex items-center justify-between border p-4 rounded bg-gray-50">
          <div className="text-black font-medium text-sm">
            {value[0]?.name || "Selected file"}
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-red-600 underline text-sm"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}; 