import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';

export default function ContactImportModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImportResult(null); // Reset result when a new file is chosen
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file to import.");
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    setIsImporting(true);

    try {
      const res = await api.post('/contacts/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportResult(res.data);
      toast.success("Import process finished!");
      if (res.data.created > 0) {
        onImportSuccess(); // Refresh the contact list in the parent component
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to import contacts.");
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleClose = () => {
      setFile(null);
      setImportResult(null);
      onClose();
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={handleClose} title="Import Contacts from CSV">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Upload a CSV file with columns: <strong>firstName</strong>, <strong>lastName</strong>, <strong>email</strong>, and (optional) <strong>phone</strong>.
        </p>
        <div className="flex items-center gap-4">
          <input type="file" accept=".csv" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={handleClose} className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700">Close</button>
          <button onClick={handleImport} disabled={!file || isImporting} className="inline-flex justify-center rounded-md border border-transparent bg-theme-accent py-2 px-4 text-sm font-medium text-white disabled:opacity-50">
            <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
            {isImporting ? 'Importing...' : 'Import'}
          </button>
        </div>
        {importResult && (
          <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200 text-sm">
            <h4 className="font-semibold">Import Complete</h4>
            <p className="text-green-600">{importResult.created} contacts created.</p>
            <p className="text-red-600">{importResult.errors} rows skipped.</p>
            {importResult.errors > 0 && (
                <details className="mt-2">
                    <summary className="cursor-pointer text-slate-500">View details</summary>
                    <ul className="list-disc pl-5 mt-1 text-xs text-slate-500 max-h-20 overflow-y-auto">
                        {importResult.errorDetails.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                </details>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}