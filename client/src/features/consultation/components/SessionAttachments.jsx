import React from 'react';
import { Paperclip } from 'lucide-react';
import UploadPreview from './UploadPreview.jsx';

/**
 * SessionAttachments — sidebar panel listing all uploaded clinical documents.
 * Delegates individual rendering to UploadPreview.
 */
const SessionAttachments = ({ attachments }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <Paperclip className="h-4 w-4 text-neutral-400" />
        <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
          Uploaded Documents
        </h3>
        <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          {attachments.length}
        </span>
      </div>

      {attachments.length === 0 ? (
        <p className="text-xs text-neutral-400 dark:text-neutral-500 italic pt-2 leading-relaxed">
          No medical records, reports, or images uploaded yet. Use the attachment button to add files.
        </p>
      ) : (
        <div className="space-y-2 max-h-[32vh] overflow-y-auto scrollbar-none pr-0.5">
          {attachments.map((file) => (
            <UploadPreview key={file.id || file.cloudinaryUrl} attachment={file} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionAttachments;
