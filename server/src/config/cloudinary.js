import 'dotenv/config';


// Clean up invalid URLs from process.env BEFORE importing cloudinary dynamically to avoid crash
if (process.env.CLOUDINARY_URL) {
  try {
    new URL(process.env.CLOUDINARY_URL);
  } catch (err) {
    delete process.env.CLOUDINARY_URL;
  }
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const hasConfig = process.env.CLOUDINARY_URL || (cloudName && apiKey && apiSecret);

if (!hasConfig) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Critical Error: Cloudinary environment configuration is missing in production.');
  } else {
    console.warn('Warning: Cloudinary configuration is missing. Uploads will run in mock mode.');
  }
}

// Dynamically import cloudinary to avoid crash if CLOUDINARY_URL is invalid in process.env
const cloudinaryModule = await import('cloudinary');
const cloudinary = cloudinaryModule.v2;

if (!process.env.CLOUDINARY_URL && hasConfig) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export default cloudinary;
export { cloudinary };
