import cloudinary from '../../../config/cloudinary.js';
import * as repo from '../consultation.repository.js';

const IS_MOCK = !process.env.CLOUDINARY_URL && (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET);

/**
 * AttachmentService — handles Cloudinary streaming and database persistence.
 * Supports graceful mock mode when Cloudinary credentials are absent.
 */

/**
 * Directly upload file to Cloudinary and persist metadata.
 */
export const saveAttachmentDirect = async (consultationId, file) => {
  let uploadResult;
  if (IS_MOCK) {
    uploadResult = {
      secure_url: `https://res.cloudinary.com/mock/image/upload/${Date.now()}_${file.originalname}`,
      public_id: `mock_${Date.now()}`,
    };
  } else {
    uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'cortexcare_attachments', resource_type: 'auto' },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(file.buffer);
    });
  }

  // Basic text extraction placeholder
  const extractedText = null;

  return await repo.createAttachment({
    consultationId,
    fileName: file.originalname,
    fileType: file.mimetype,
    cloudinaryUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    extractedText,
  });
};

/**
 * Upload file to Cloudinary, extract available text, and persist metadata.
 */
export const saveAttachment = async (userId, consultationId, file) => {
  const consultation = await repo.findById(consultationId);
  if (!consultation) return { success: false, status: 404, error: 'Consultation not found.' };
  if (consultation.patient.userId !== userId) return { success: false, status: 403, error: 'Access denied.' };

  const openStatuses = ['SETUP', 'ACTIVE'];
  if (!openStatuses.includes(consultation.status)) {
    return { success: false, status: 400, error: `Cannot upload to a ${consultation.status} consultation.` };
  }

  const attachment = await saveAttachmentDirect(consultationId, file);
  return { success: true, attachment };
};
