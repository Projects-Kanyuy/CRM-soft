import { useEffect, useState, useRef } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { PaperClipIcon, ArrowUpOnSquareIcon, TrashIcon, DocumentIcon } from '@heroicons/react/24/outline';

export default function FileAttachments({ parentId, parentType }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await api.get(`/api/${parentType}/${parentId}/files`);
        setFiles(res.data);
      } catch (error) {
        toast.error("Failed to fetch general attachments.");
      }
    };
    if (parentId && parentType) fetchFiles();
  }, [parentId, parentType]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    setIsUploading(true);

    try {
      const res = await api.post(`/api/${parentType}/${parentId}/files`, formData);
      setFiles(prevFiles => [res.data, ...prevFiles]); // Add new file to the top of the list
      setSelectedFile(null);
      if(fileInputRef.current) fileInputRef.current.value = ""; // Reset the file input visually
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
        try {
            const res = await api.delete(`/api/${parentType}/${parentId}/files/${fileId}`);
            setFiles(prevFiles => prevFiles.filter(f => f._id !== res.data.id));
            toast.success("File deleted.");
        } catch (error) {
            toast.error("Failed to delete file.");
        }
    }
  };
  
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <PaperClipIcon className="h-5 w-5 text-slate-500" /> Other Attachments
      </h2>
      <div className="flex items-center gap-4 mb-6 border-b pb-6 border-slate-200">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
        <button onClick={handleUpload} disabled={!selectedFile || isUploading} className="inline-flex items-center rounded-lg bg-white border border-slate-300 py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50">
          <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
      <ul className="space-y-3">
        {files.length > 0 ? files.map(file => (
          <li key={file.public_id} className="group flex items-center justify-between p-2 -m-2 rounded-md hover:bg-slate-50">
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-md bg-slate-100 flex items-center justify-center">
                <DocumentIcon className="h-6 w-6 text-slate-500" />
              </div>
              <div>
                <p className="font-medium text-slate-800 group-hover:text-theme-accent">{file.originalname}</p>
                <p className="text-sm text-slate-500">{(file.size / (1024*1024)).toFixed(2)} MB</p>
              </div>
            </a>
            <button onClick={() => handleDelete(file._id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity">
              <TrashIcon className="h-5 w-5" />
            </button>
          </li>
        )) : (
          <p className="text-sm text-slate-500 text-center py-4">No other files attached.</p>
        )}
      </ul>
    </div>
  );
}