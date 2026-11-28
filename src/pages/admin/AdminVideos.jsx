import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Play,
  Video as VideoIcon,
  X,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import VideoFormModal from "../../components/admin/VideoFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

function formatFileSize(bytes = 0) {
  const num = Number(bytes) || 0;
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AdminVideos() {
  const toast = useToast();

  const [videos, setVideos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [vidRes, prodRes] = await Promise.all([
        api.getAdminVideos({
          search: search.trim(),
          product: productFilter,
          status: statusFilter,
        }),
        api.getAdminProducts({ limit: 100 }),
      ]);
      setVideos(vidRes?.videos || []);
      setProducts(prodRes?.products || []);
    } catch (err) {
      toast.error(err.message || "Failed to load product videos.");
    } finally {
      setLoading(false);
    }
  }, [search, productFilter, statusFilter, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async (video) => {
    const nextStatus = video.status === "published" ? "draft" : "published";
    try {
      await api.updateAdminVideo(video._id, { status: nextStatus });
      toast.success(`"${video.title}" marked ${nextStatus}.`);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to update video status.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.deleteAdminVideo(deleteTarget._id);
      toast.success(`Deleted "${deleteTarget.title}" permanently.`);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to delete video.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Videos"
      subtitle={`${videos.length} product video${videos.length !== 1 ? "s" : ""} in library`}
      actions={
        <button
          type="button"
          onClick={() => {
            setEditingVideo(null);
            setModalOpen(true);
          }}
          className="h-9 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3.5 text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Video</span>
        </button>
      }
    >
      {/* Filters Bar */}
      <div className="rounded-2xl bg-white border border-[#E6E6E1] p-4 mb-5 shadow-[0_2px_10px_rgba(20,22,26,0.03)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B97A8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos by title or description..."
              className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] pl-9 pr-3 text-xs sm:text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-xs font-medium text-[#14161A] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="">All Products</option>
            {products.map((prod) => (
              <option key={prod._id} value={prod._id}>
                {prod.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-xs font-medium text-[#14161A] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-white border border-[#E6E6E1] animate-pulse"
            />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E6E6E1] p-12 text-center">
          <VideoIcon className="w-10 h-10 text-[#8B97A8] mx-auto mb-3" />
          <p className="font-['Outfit'] text-lg font-bold text-[#14161A]">
            No product videos yet
          </p>
          <p className="text-xs text-[#6B727C] mt-1">
            Upload an MP4 or WebM demonstration video and assign it to any product.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingVideo(null);
              setModalOpen(true);
            }}
            className="mt-4 h-10 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 text-xs font-semibold text-white inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload First Video</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video._id}
              className="rounded-2xl bg-white border border-[#E6E6E1] overflow-hidden flex flex-col justify-between shadow-[0_2px_12px_rgba(20,22,26,0.03)]"
            >
              <div>
                {/* Thumbnail Preview Trigger */}
                <button
                  type="button"
                  onClick={() => setPreviewVideo(video)}
                  className="group relative aspect-video w-full bg-[#14161A] overflow-hidden block text-left"
                >
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white/40">
                      <VideoIcon className="w-10 h-10" />
                    </div>
                  )}

                  <span className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
                    <span className="h-11 w-11 rounded-full bg-white/95 text-[#14161A] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Play className="w-4 h-4 fill-[#14161A] ml-0.5" />
                    </span>
                  </span>

                  <span className="absolute top-2.5 left-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {video.format} · {formatFileSize(video.fileSize)}
                  </span>
                </button>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-['Outfit'] text-base font-bold text-[#14161A] line-clamp-1">
                        {video.title}
                      </h2>
                      {video.titleHi && (
                        <p className="text-[11px] text-[#6B727C] truncate">
                          {video.titleHi}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(video)}
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase transition-colors ${
                        video.status === "published"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-[#F4F4F1] text-[#6B727C] hover:bg-[#E6E6E1]"
                      }`}
                    >
                      {video.status}
                    </button>
                  </div>

                  <p className="text-[11px] font-medium text-[var(--accent)] truncate">
                    {video.product?.name || "Unassigned Product"}
                    {video.product?.sku ? ` · ${video.product.sku}` : ""}
                  </p>

                  {video.description && (
                    <p className="text-xs text-[#4A5058] leading-relaxed line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-4 py-3 border-t border-[#F1F1ED] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewVideo(video)}
                  className="text-xs font-semibold text-[#4A5058] hover:text-[var(--accent)] inline-flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVideo(video);
                      setModalOpen(true);
                    }}
                    className="h-8 rounded-lg border border-[#E6E6E1] bg-white px-2.5 text-xs font-semibold text-[#14161A] hover:bg-[#F4F4F1] inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit / Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(video)}
                    className="h-8 w-8 rounded-lg border border-[#E6E6E1] bg-white flex items-center justify-center text-red-500 hover:bg-red-50"
                    aria-label={`Delete ${video.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Edit / Replace Modal */}
      <VideoFormModal
        open={modalOpen}
        initialVideo={editingVideo}
        products={products}
        onClose={() => setModalOpen(false)}
        onSaved={loadData}
      />

      {/* Preview Modal (draft & published review before publishing) */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Inter']">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setPreviewVideo(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-3xl rounded-2xl bg-white border border-[#E6E6E1] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E6E6E1] bg-[#FAFAF8]">
              <div className="min-w-0">
                <h3 className="font-['Outfit'] text-base font-bold text-[#14161A] truncate">
                  {previewVideo.title}
                </h3>
                <p className="text-[11px] text-[#6B727C] truncate">
                  {previewVideo.product?.name} · {previewVideo.status.toUpperCase()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="h-8 w-8 rounded-lg border border-[#E6E6E1] bg-white flex items-center justify-center text-[#6B727C] hover:text-[#14161A]"
                aria-label="Close video preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-black">
              <video
                src={previewVideo.videoUrl}
                poster={previewVideo.thumbnailUrl || undefined}
                controls
                playsInline
                preload="metadata"
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Video Permanently?"
        description={`This will remove "${deleteTarget?.title || ""}" from MongoDB and permanently delete the video asset from Cloudinary.`}
        confirmLabel="Delete Video"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
