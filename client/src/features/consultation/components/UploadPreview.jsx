import React from 'react';
import { FileText, Image, File, ExternalLink } from 'lucide-react';

const ICON_MAP = {
  'application/pdf': FileText,
  'image/jpeg': Image,
  'image/png': Image,
  'image/jpg': Image,
  'image/webp': Image,
};

const getIcon = (fileType) => {
  const Icon = ICON_MAP[fileType] || File;
  return <Icon className="h-4 w-4" />;
};

const formatSize = (bytes) => {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * UploadPreview — renders a single uploaded attachment as a card.
 * Shows file icon, name, type, and a link to view in Cloudinary.
 */
const UploadPreview = ({ attachment }) => {
  const { fileName, fileType, cloudinaryUrl, uploadedAt } = attachment;

  const uploadedTime = uploadedAt
    ? new Date(uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <a
      href={cloudinaryUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 hover:bg-white dark:hover:bg-neutral-850 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-150"
      title="View uploaded file"
    >
      <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
        {getIcon(fileType)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate leading-tight">
          {fileName}
        </p>
        <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wide">
          {fileType?.split('/')[1] || 'file'}
          {uploadedTime && ` · ${uploadedTime}`}
        </p>
      </div>

      <ExternalLink className="h-3.5 w-3.5 text-neutral-400 group-hover:text-indigo-500 transition-colors shrink-0 mt-0.5" />
    </a>
  );
};

export default UploadPreview;
