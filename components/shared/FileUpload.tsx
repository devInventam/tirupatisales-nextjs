"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeBytes?: number;
  onFileSelect: (file: File | undefined) => void;
  error?: string;
  className?: string;
}

export default function FileUpload({
  label = "Upload file (PDF, DOCX, Images up to 10MB)",
  accept = ".pdf,.docx,.doc,.jpg,.jpeg,.png",
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  onFileSelect,
  error,
  className,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    setLocalError(null);
    if (!file) {
      setSelectedFile(null);
      onFileSelect(undefined);
      return;
    }

    if (file.size > maxSizeBytes) {
      const mb = Math.round(maxSizeBytes / (1024 * 1024));
      const err = `File size exceeds the ${mb}MB limit.`;
      setLocalError(err);
      setSelectedFile(null);
      onFileSelect(undefined);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setLocalError(null);
    onFileSelect(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-xs font-semibold text-foreground/80">
          {label}
        </label>
      )}

      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors bg-muted/30 hover:bg-muted/50",
            isDragging ? "border-red-500 bg-red-50/50" : "border-border",
            (error || localError) && "border-red-400 bg-red-50/20"
          )}
        >
          <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-xs font-medium text-foreground">
            Click to upload or drag and drop
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Max file size: 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {(error || localError) && (
        <p className="text-xs text-red-500 mt-1">{error || localError}</p>
      )}
    </div>
  );
}
