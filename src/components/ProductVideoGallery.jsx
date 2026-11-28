import { useEffect, useRef, useState } from "react";
import { Play, Video as VideoIcon } from "lucide-react";
import { api } from "../services/api";
import { useTranslation } from "../i18n/LanguageContext";

/**
 * Fetch published videos for a product and refresh when the tab regains focus
 * so unpublished or deleted videos disappear immediately.
 */
export function useProductVideos(product) {
  const [videos, setVideos] = useState([]);

  const productLookup =
    product?._id && /^[a-f0-9]{24}$/i.test(String(product._id))
      ? String(product._id)
      : String(product?.slug || product?.id || "");

  useEffect(() => {
    let ignore = false;

    async function loadVideos() {
      if (!productLookup) {
        setVideos([]);
        return;
      }

      try {
        const res = await api.getPublicVideos({ product: productLookup });
        if (!ignore) {
          setVideos(Array.isArray(res?.videos) ? res.videos : []);
        }
      } catch {
        if (!ignore) {
          setVideos([]);
        }
      }
    }

    loadVideos();

    const handleFocus = () => loadVideos();
    window.addEventListener("focus", handleFocus);

    return () => {
      ignore = true;
      window.removeEventListener("focus", handleFocus);
    };
  }, [productLookup]);

  return videos;
}

/**
 * Enlarged 3:2 video player rendered inside the main ProductDetailTemplate gallery stage.
 */
export function ProductStageVideo({ video, autoStart = false, videoRef: externalRef }) {
  const { t } = useTranslation();
  const fallbackRef = useRef(null);
  const resolvedRef = externalRef || fallbackRef;
  const [activated, setActivated] = useState(autoStart);

  useEffect(() => {
    setActivated(autoStart);
    if (autoStart) {
      const id = setTimeout(() => {
        resolvedRef.current?.play?.().catch(() => {});
      }, 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [video._id, autoStart, resolvedRef]);

  useEffect(() => {
    const el = resolvedRef.current;
    return () => {
      el?.pause?.();
    };
  }, [video._id, resolvedRef]);

  const handlePlayTrigger = () => {
    setActivated(true);
    resolvedRef.current?.play?.().catch(() => {});
  };

  return (
    <div className="relative w-full h-full bg-[#14161A] overflow-hidden">
      <video
        ref={resolvedRef}
        src={video.videoUrl}
        controls
        playsInline
        autoPlay={autoStart}
        preload={activated ? "metadata" : "none"}
        poster={video.thumbnailUrl || undefined}
        onPlay={() => setActivated(true)}
        className="h-full w-full object-contain bg-black"
      />

      {!activated && (
        <button
          type="button"
          onClick={handlePlayTrigger}
          aria-label={`${t("productDetail.productVideoLabel")}: ${video.title || t("productDetail.productVideoLabel")}`}
          className="group/play absolute inset-0 w-full h-full bg-[#14161A] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title || t("productDetail.productVideoLabel")}
              className="h-full w-full object-contain opacity-95 group-hover/play:opacity-100 transition-opacity duration-200"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-white/40">
              <VideoIcon className="w-12 h-12" />
            </div>
          )}

          <span className="absolute inset-0 bg-black/20 group-hover/play:bg-black/30 transition-colors flex items-center justify-center">
            <span className="h-14 w-14 rounded-full bg-white/95 text-[#14161A] flex items-center justify-center shadow-lg group-hover/play:scale-105 transition-transform">
              <Play className="w-6 h-6 fill-[#14161A] ml-0.5" />
            </span>
          </span>

          {video.title && (
            <span className="absolute top-3 left-3 max-w-[75%] truncate rounded-full bg-black/65 backdrop-blur-xs border border-white/15 px-3 py-1 text-[11px] font-medium text-white">
              {video.title}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
