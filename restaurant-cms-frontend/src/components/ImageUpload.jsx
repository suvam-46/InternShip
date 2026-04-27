import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../services/api';
import './ImageUpload.css';

const ImageUpload = ({ value, onChange, label = 'Upload Image' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Standard size check (Cloudinary handles large files, but 5MB is safe for Base64 transit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please select an image under 5MB.');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result;
        // Upload to our backend which proxies to Cloudinary
        const res = await api.post('/upload', { image: base64 });
        
        if (res.data?.success) {
          onChange(res.data.url); // Set the Cloudinary URL
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('Failed to upload image to Cloudinary. Check your credentials.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      alert('Failed to read file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <label className="form-label">{label}</label>
      
      <div 
        className={`image-upload-box ${value ? 'has-image' : ''}`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden-input"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="upload-placeholder">
            <Loader2 className="spinner" size={24} />
            <span>Uploading to Cloud...</span>
          </div>
        ) : value ? (
          <div className="image-preview-wrapper">
            <img src={value} alt="Preview" className="image-preview" />
            <div className="image-badge">Cloud</div>
            <button className="remove-image-btn" onClick={removeImage} title="Remove Image">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <Upload size={24} className="upload-icon" />
            <div className="upload-text">
              <span className="primary-text">Click to upload</span>
              <span className="secondary-text">Cloudinary enabled</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
