import React, { useState, useRef, useCallback } from 'react';
import { uploadAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './ImageUploader.css';

/**
 * ImageUploader
 *
 * Props:
 *   type        — 'property' | 'place' | 'experience' | 'avatar'
 *   maxFiles    — max number of images (default: type-based)
 *   onUploaded  — callback(images: [{url, public_id}]) called after successful upload
 *   existingImages — [{url, public_id}] already saved images to display
 *   onRemove    — callback(public_id) when an existing image is removed
 */
const MAX_BY_TYPE = { property: 10, place: 8, experience: 6, avatar: 1 };

const ImageUploader = ({
  type = 'property',
  maxFiles,
  onUploaded,
  existingImages = [],
  onRemove,
}) => {
  const max = maxFiles ?? MAX_BY_TYPE[type] ?? 10;
  const isAvatar = type === 'avatar';

  const [previews, setPreviews]     = useState([]);   // { file, localUrl }
  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [dragOver, setDragOver]     = useState(false);
  const inputRef = useRef();

  const handleFiles = useCallback((files) => {
    const remaining = max - existingImages.length - previews.length;
    if (remaining <= 0) {
      toast.warning(`Maximum ${max} image${max > 1 ? 's' : ''} allowed`);
      return;
    }

    const allowed = Array.from(files).slice(0, remaining);
    const invalid = allowed.filter(f => !f.type.startsWith('image/'));
    if (invalid.length) {
      toast.error('Only image files (jpg, png, webp) are allowed');
      return;
    }

    const oversized = allowed.filter(f => f.size > 8 * 1024 * 1024);
    if (oversized.length) {
      toast.error('Each image must be under 8 MB');
      return;
    }

    const newPreviews = allowed.map(file => ({
      file,
      localUrl: URL.createObjectURL(file),
    }));

    if (isAvatar) {
      setPreviews(newPreviews.slice(0, 1));
    } else {
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  }, [max, existingImages.length, previews.length, isAvatar]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleInputChange = (e) => handleFiles(e.target.files);

  const removePreview = (idx) => {
    setPreviews(prev => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].localUrl);
      copy.splice(idx, 1);
      return copy;
    });
  };

  const handleUpload = async () => {
    if (previews.length === 0) {
      toast.info('Please select at least one image first');
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      const fieldName = isAvatar ? 'avatar' : 'images';
      previews.forEach(({ file }) => formData.append(fieldName, file));

      setProgress(40);

      let response;
      if (type === 'property')   response = await uploadAPI.uploadPropertyImages(formData);
      else if (type === 'place') response = await uploadAPI.uploadPlaceImages(formData);
      else if (type === 'experience') response = await uploadAPI.uploadExperienceImages(formData);
      else if (type === 'avatar')    response = await uploadAPI.uploadAvatar(formData);

      setProgress(90);

      // Normalize response — avatar returns {url, public_id}, others return {images:[...]}
      const uploaded = isAvatar
        ? [{ url: response.data.url, public_id: response.data.public_id }]
        : (response.data.images || []);

      // Revoke local URLs to free memory
      previews.forEach(p => URL.revokeObjectURL(p.localUrl));
      setPreviews([]);
      setProgress(100);

      toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded successfully!`);
      if (onUploaded) onUploaded(uploaded);
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(msg);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const handleRemoveExisting = async (publicId) => {
    try {
      await uploadAPI.deleteImage(publicId);
      toast.success('Image removed');
      if (onRemove) onRemove(publicId);
    } catch {
      toast.error('Failed to remove image');
    }
  };

  const totalSelected = existingImages.length + previews.length;
  const canAddMore = totalSelected < max;

  return (
    <div className="img-uploader">
      {/* Drop Zone */}
      {canAddMore && (
        <div
          className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Click or drag images to upload"
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <div className="drop-zone-icon">📁</div>
          <div className="drop-zone-text">
            {dragOver ? 'Drop images here' : 'Click to select or drag & drop images'}
          </div>
          <div className="drop-zone-hint">
            JPG, PNG, WebP · Max 8 MB each · {totalSelected}/{max} selected
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={!isAvatar}
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* Existing Images (already saved in DB) */}
      {existingImages.length > 0 && (
        <div className="img-grid">
          {existingImages.map((img, i) => (
            <div key={img.public_id || i} className="img-thumb">
              <img src={img.url} alt={`Uploaded ${i + 1}`} />
              <div className="img-thumb-label">Saved</div>
              {onRemove && (
                <button
                  className="img-remove"
                  onClick={() => handleRemoveExisting(img.public_id)}
                  title="Remove image"
                  aria-label="Remove image"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Preview new selections */}
      {previews.length > 0 && (
        <div className="img-grid">
          {previews.map((p, i) => (
            <div key={p.localUrl} className="img-thumb img-thumb-new">
              <img src={p.localUrl} alt={`Preview ${i + 1}`} />
              <div className="img-thumb-label">New</div>
              <button
                className="img-remove"
                onClick={() => removePreview(i)}
                title="Remove"
                aria-label="Remove preview"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {uploading && progress > 0 && (
        <div className="upload-progress">
          <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
          <span>Uploading to Cloudinary... {progress}%</span>
        </div>
      )}

      {/* Upload button */}
      {previews.length > 0 && (
        <button
          className={`btn-upload ${uploading ? 'uploading' : ''}`}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading
            ? `Uploading ${previews.length} image${previews.length > 1 ? 's' : ''}…`
            : `☁️ Upload ${previews.length} image${previews.length > 1 ? 's' : ''} to Cloudinary`}
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
