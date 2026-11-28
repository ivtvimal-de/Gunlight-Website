import { useState, useEffect, useRef } from "react";
import { X, Upload, Film, RefreshCw } from "lucide-react";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

function formatBytes(bytes = 0) {
  const num = Number(bytes) || 0;
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(2)} MB`;
}

export default function VideoFormModal({
  open,
  initialVideo = null,
  products = [],
  onClose,
  onSaved,
}) {
  const isEditing = Boolean(initialVideo?._id);
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState("draft");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) return;

    setFormError("");
    setUploadProgress(0);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (initialVideo) {
      setTitle(initialVideo.title || "");
      setDescription(initialVideo.description || "");
      const pid = initialVideo.product?._id || initialVideo.product || "";
      setProductId(String(pid));
      setStatus(initialVideo.status || "draft");
    } else {
      const firstProd = products[0]?._id ? String(products[0]._id) : "";
      setTitle("");
      setDescription("");
      setProductId(firstProd);
      setStatus("draft");
    }
  }, [open, initialVideo, products]);

  // Manage temporary object URL lifecycle cleanly so client-side previews never leak memory
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return undefined;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFormError("");
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const lowerName = String(file.name || "").toLowerCase();
    const mime = String(file.type || "").toLowerCase();
    const validMime = ALLOWED_VIDEO_TYPES.has(mime);
    const validExt = lowerName.endsWith(".mp4") || lowerName.endsWith(".webm");

    if (!validMime && !validExt) {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFormError("Only MP4 and WebM video files are supported.");
      return;
    }

    if (mime && !ALLOWED_VIDEO_TYPES.has(mime)) {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFormError(`Unsupported file type "${file.type}". Please choose an MP4 or WebM video.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) return setFormError("Video title is required.");
    if (cleanTitle.length > 140) {
      return setFormError("Video title cannot exceed 140 characters.");
    }
    if (!productId) return setFormError("Please assign a product.");
    if (!isEditing && !selectedFile) {
      return setFormError("Please select an MP4 or WebM video file to upload.");
    }

    const fields = {
      title: cleanTitle,
      description: cleanDescription,
      product: productId,
      status,
    };

    try {
      setSaving(true);
      setUploadProgress(selectedFile ? 2 : 0);

      if (isEditing) {
        if (selectedFile) {
          await api.replaceAdminVideo(initialVideo._id, {
            file: selectedFile,
            fields,
            onProgress: (pct) => setUploadProgress(pct),
          });
          toast.success(`Video "${cleanTitle}" replaced and updated.`);
        } else {
          await api.updateAdminVideo(initialVideo._id, fields);
          toast.success(`Video "${cleanTitle}" updated.`);
        }
      } else {
        await api.createAdminVideo({
          file: selectedFile,
          fields,
          onProgress: (pct) => setUploadProgress(pct),
        });
        toast.success(`Video "${cleanTitle}" uploaded.`);
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      setFormError(err.message || "Failed to save video.");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const activePreviewSrc = previewUrl || (isEditing ? initialVideo?.videoUrl || "" : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 font-['Inter']">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={!saving ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-[#E6E6E1] shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E6E6E1] bg-[#FAFAF8] shrink-0">
          <div>
            <h2 className="font-['Outfit'] text-lg sm:text-xl font-bold text-[#14161A]">
              {isEditing ? `Edit Video — ${initialVideo.title}` : "Upload Product Video"}
            </h2>
            <p className="text-xs text-[#6B727C]">
              MP4 or WebM videos are validated by file signature and stored in Cloudinary.
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="h-9 w-9 rounded-xl border border-[#E6E6E1] bg-white flex items-center justify-center text-[#6B727C] hover:text-[#14161A] disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
              Video Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={140}
              disabled={saving}
              placeholder="e.g. Eagle 3.1 Long-Range Beam Demonstration"
              className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Assign to Product *
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                disabled={saving}
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none disabled:opacity-60"
              >
                <option value="">Select product...</option>
                {products.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.name} ({prod.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Visibility Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none disabled:opacity-60"
              >
                <option value="draft">Draft (Hidden)</option>
                <option value="published">Published (Visible)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              disabled={saving}
              placeholder="Optional overview shown alongside the video..."
              className="w-full rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3.5 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none disabled:opacity-60"
            />
          </div>

          {/* File Picker & Client-Side Preview Before Upload */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#14161A]">
                  {isEditing ? "Video File (Optional Replace)" : "Video File * (MP4 or WebM)"}
                </label>
                <p className="text-[11px] text-[#6B727C]">
                  {isEditing
                    ? "Leave unchanged to keep the current video, or select a new MP4/WebM file to replace it."
                    : "Preview your MP4 or WebM video below before uploading."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedFile && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleClearSelectedFile}
                    className="h-9 rounded-xl border border-[#E6E6E1] bg-white px-3 text-xs font-semibold text-[#4A5058] hover:bg-[#F4F4F1] disabled:opacity-50"
                  >
                    Clear Selection
                  </button>
                )}
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 rounded-xl bg-[#14161A] hover:bg-[var(--accent)] px-3.5 text-xs font-semibold text-white inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isEditing ? (
                    <RefreshCw className="w-3.5 h-3.5" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {selectedFile
                      ? "Change File"
                      : isEditing
                      ? "Choose Replacement"
                      : "Select Video"}
                  </span>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,.mp4,.webm"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-[#14161A] truncate">
                  {selectedFile.name}
                </span>
                <span className="text-[#6B727C] tabular-nums shrink-0">
                  {formatBytes(selectedFile.size)}
                </span>
              </div>
            )}

            {activePreviewSrc ? (
              <div className="rounded-2xl overflow-hidden border border-[#E6E6E1] bg-[#14161A]">
                <video
                  key={activePreviewSrc}
                  src={activePreviewSrc}
                  poster={!previewUrl && isEditing ? initialVideo?.thumbnailUrl || undefined : undefined}
                  controls
                  playsInline
                  preload={previewUrl ? "metadata" : "none"}
                  className="w-full max-h-64 object-contain bg-black"
                />
              </div>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed border-[#D5D5CF] bg-[#FAFAF8] hover:border-[var(--accent)] p-8 text-center transition-colors disabled:opacity-50"
              >
                <Film className="w-8 h-8 text-[#8B97A8] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#14161A]">
                  Click to choose an MP4 or WebM video
                </p>
                <p className="text-[11px] text-[#6B727C] mt-0.5">
                  A preview player will appear here before uploading
                </p>
              </button>
            )}

            {saving && selectedFile && (
              <div className="rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-[#14161A]">
                  <span>
                    {uploadProgress >= 100
                      ? "Processing upload on Cloudinary..."
                      : "Uploading video..."}
                  </span>
                  <span className="tabular-nums">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E6E6E1] overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-[#E6E6E1] bg-[#FAFAF8] shrink-0">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="h-10 rounded-xl border border-[#E6E6E1] bg-white px-4 text-xs font-semibold text-[#14161A] hover:bg-[#F4F4F1] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="h-10 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 text-xs font-semibold text-white shadow-xs disabled:opacity-50"
          >
            {saving
              ? selectedFile
                ? "Uploading..."
                : "Saving..."
              : isEditing
              ? "Save Changes"
              : "Upload Video"}
          </button>
        </div>
      </div>
    </div>
  );
}
