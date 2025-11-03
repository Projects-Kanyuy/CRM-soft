import { useRef } from 'react';
import { ArrowUpOnSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ImageGallery({ pictures, onUpload, onDelete, isUploading }) {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Pictures</h2>
        <input type="file" multiple ref={fileInputRef} onChange={onUpload} className="hidden" accept="image/*" />
        <button onClick={() => fileInputRef.current.click()} disabled={isUploading} className="inline-flex items-center rounded-lg bg-white border border-slate-300 py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50">
          <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
          {isUploading ? 'Uploading...' : 'Add Pictures'}
        </button>
      </div>
      {pictures?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pictures.map(pic => (
            <div key={pic.public_id} className="group relative aspect-square">
              <img src={pic.url} alt="Client photograph" className="rounded-lg object-cover w-full h-full" />
              <button onClick={() => onDelete(pic.public_id)} className="absolute top-1 right-1 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-opacity">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : <p className="text-sm text-slate-500 text-center py-4">No pictures uploaded yet.</p>}
    </div>
  );
}