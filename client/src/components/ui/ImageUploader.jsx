import { UploadCloud, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

export default function ImageUploader({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files) => {
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        if (supabase) {
          const path = `${Date.now()}-${file.name}`;
          const { error } = await supabase.storage.from("car-images").upload(path, file, { upsert: true });
          if (error) throw error;
          const { data } = supabase.storage.from("car-images").getPublicUrl(path);
          urls.push(data.publicUrl);
        } else {
          urls.push(URL.createObjectURL(file));
        }
      }
      onChange?.([...value, ...urls]);
      toast.success("Images ready");
    } catch (error) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => onChange?.(value.filter((item) => item !== url));

  return (
    <div>
      <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center border border-dashed border-red-900/80 bg-black/40 p-6 text-center hover:bg-red-950/20">
        <UploadCloud className="mb-3 h-8 w-8 text-red-500" />
        <span className="font-display text-sm uppercase tracking-[.18em]">{uploading ? "Uploading" : "Upload car images"}</span>
        <span className="mt-2 text-sm text-zinc-500">Drag files here or select multiple images</span>
        <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => uploadFiles([...event.target.files])} />
      </label>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {value.map((url, index) => (
          <div key={url} className="relative border border-white/10 bg-zinc-950">
            <img src={url} alt={`Upload ${index + 1}`} className="h-28 w-full object-cover" />
            {index === 0 && <span className="absolute left-2 top-2 bg-red-700 px-2 py-1 text-[10px] font-black uppercase">Primary</span>}
            <button type="button" className="icon-btn absolute right-2 top-2" onClick={() => removeImage(url)} aria-label="Remove image">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
