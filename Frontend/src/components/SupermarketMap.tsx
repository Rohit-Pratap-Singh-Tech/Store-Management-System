import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

// Replace with your real map image
const MAP_IMAGE =
  "/supermarket.png";

// Dummy block coordinates (px in natural image size)
// Update these for your map or let backend return rect
const BLOCK_RECTS: Record<
  string,
  { x: number; y: number; width: number; height: number }
> = {
  A: { x: 80, y: 160, width: 240, height: 140 },
  B: { x: 360, y: 160, width: 240, height: 140 },
  C: { x: 640, y: 160, width: 240, height: 140 },
};

function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState("");
  return (
    <div className="flex w-full gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(q)}
          placeholder="Search item e.g. Rice"
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
      <button
        onClick={() => onSearch(q)}
        className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow"
      >
        Find
      </button>
    </div>
  );
}

export default function SupermarketMap() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [display, setDisplay] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const updateSizes = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      }
      setDisplay({ w: img.clientWidth, h: img.clientHeight });
    };
    updateSizes();
    const ro = new ResizeObserver(updateSizes);
    ro.observe(img);
    img.addEventListener("load", updateSizes);
    return () => {
      ro.disconnect();
      img.removeEventListener("load", updateSizes);
    };
  }, []);

  const onSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
  
    // Mock result instead of fetch
    await new Promise((res) => setTimeout(res, 500)); // fake delay
    setResult({
      name: q,
      block: "A",
      shelf: "1",
      box: "4",
      rect: { x: 80, y: 160, width: 240, height: 140 },
    });
  
    setLoading(false);
  };

  const naturalRect = useMemo(() => {
    if (!result) return null;
    if (result?.rect) return result.rect;
    return BLOCK_RECTS[result.block?.toUpperCase?.()] ?? null;
  }, [result]);

  const scaledRect = useMemo(() => {
    if (!naturalRect || !natural || !display) return null;
    const sx = display.w / natural.w;
    const sy = display.h / natural.h;
    return {
      x: naturalRect.x * sx,
      y: naturalRect.y * sy,
      width: naturalRect.width * sx,
      height: naturalRect.height * sy,
    };
  }, [naturalRect, natural, display]);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Store Map Search</h1>

      <SearchBar onSearch={onSearch} />

      <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-gray-200">
        <img ref={imgRef} src={MAP_IMAGE} alt="Store map" className="w-full h-auto" />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <AnimatePresence>
            {scaledRect && (
              <motion.rect
                x={scaledRect.x}
                y={scaledRect.y}
                width={scaledRect.width}
                height={scaledRect.height}
                fill="rgba(16, 185, 129, 0.15)"
                stroke="rgba(16, 185, 129, 1)"
                strokeWidth={3}
                rx={10}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </svg>
      </div>

      <div className="rounded-2xl border p-4 shadow-sm bg-white">
        {loading && <p>Searching…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && result && (
          <>
            <h2 className="text-xl font-medium">{result.name}</h2>
            <p>
              Block {result.block}
              {result.shelf && <> · Shelf {result.shelf}</>}
              {result.box && <> · Box {result.box}</>}
            </p>
          </>
        )}
      </div>
    </div>
  );
}