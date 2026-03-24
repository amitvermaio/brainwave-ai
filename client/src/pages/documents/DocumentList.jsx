import React from 'react'
import { Plus, Upload, Trash2, FileText, X } from 'lucide-react'
import { toast } from 'sonner';

import { useSelector, useDispatch } from 'react-redux';
import { asyncuploaddocument, asyncdeletedocument } from '../../store/actions/documentActions';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import DocumentCard from '../../components/documents/DocumentCard';

const DocumentList = () => {
  const { documents, loading } = useSelector(state => state.document);
  const dispatch = useDispatch();

  // State for Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [uploadFile, setUploadFile] = React.useState(null);
  const [uploadTitle, setUploadTitle] = React.useState('');
  const [uploading, setUploading] = React.useState(false);

  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [selectedDoc, setSelectedDoc] = React.useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension for title
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile || !uploadTitle.trim()) {
      toast.error("Please select a file and enter a title.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle.trim());

    try {
      await dispatch(asyncuploaddocument(formData));
      toast.success("Document uploaded successfully.");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle('');
    } catch (error) {
      toast.error("Failed to upload document.");
      console.log(error);
    } finally {
      setUploading(false);
    }
  }

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);

    try {
      await dispatch(asyncdeletedocument(selectedDoc._id));
      toast.success(`${selectedDoc.title} deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      // again do the fetching of documents to update the list after deletion
      // or just do filter from sync action
    } catch (error) {
      toast.error("Failed to delete document.");
      console.log(error);
    } finally {
      setDeleting(false);
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex items-center justify-center min-h-[400px]'>
          <Spinner />
        </div>
      )
    }

    if (documents.length === 0) {
      return (
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center max-w-md'>
            <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-8'>
              <FileText
                className='w-10 h-10 text-slate-400'
                strokeWidth={1.5}
              />
            </div>
            <h3 className='text-xl font-medium text-slate-900 tracking-tight mb-2'>
              No Documents Yet
            </h3>
            <p className='text-sm text-slate-500 mb-6'>
              Get started by Uploading your first document to begin learning.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className='inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-hover-600 hover:to-teal-600  text-sm font-semibold rounded-xl transition-all durations-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]'
            >
              <Plus className='w-4 h-4' strokeWidth={2.5} />
              Upload Document
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {documents?.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='min-h-screen relative'>

      {/* subtle bg pattern */}
      <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none'></div>

      {/* actual content */}
      <div className='relative max-w-7xl mx-auto px-4 py-10'>

        {/* header */}
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'>
              My Documents
            </h1>
            <p className='text-slate-500 text-sm'>
              Manage and organize your learning materials
            </p>
          </div>

          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className='w-4 h-4' strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>
        {renderContent()}
      </div>
      {isUploadModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm '>
          <div className='relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8'>
            {/* close button */}
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className='absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200'
            >
              <X className='w-5 h-5' strokeWidth={2} />
            </button>

            {/* Modal Header */}
            <div className='mb-6'>
              <h2 className='text-xl font-medium text-slate-900 tracking-tight'>
                Upload New Document
              </h2>
              <p className='text-sm text-slate-500 mt-1'>
                Add a Document to your library
              </p>
            </div>

            {/* form */}
            <form onSubmit={handleUpload} className='space-y-5'>
              {/* tilte input */}
              <div className='space-y-2'>
                <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wide'>
                  Document Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  className='w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200'
                  placeholder='e.g., React Interview Prep'
                />
              </div>

              {/* file upload */}
              <div className='space-y-2'>
                <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wide'>
                  File
                </label>
                <div className='relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:border-emerald-50/30 transition-all duration-200'>
                  <input
                    id='file-upload'
                    type="file"
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  />
                  <div className='flex flex-col items-center justify-center py-10 px-6'>
                    <div className='w-14 h-14 rounded-xl bg-linear-to-r from-emerald-100 to-teal-100 flex items-center justify-center mb-4'>
                      <Upload className='w-7 h-7 text-emerald-600' strokeWidth={2} />
                    </div>
                    <p className='text-sm font-medium text-slate-700 mb-1'>
                      {uploadFile ? (
                        <span className='text-emerald-600'>
                          {uploadFile.name}
                        </span>
                      ) : (
                        <>
                          <span className='text-emerald-600'>
                            Click to Upload
                          </span>{" "}
                          or drag and drop
                        </>
                      )}
                    </p>
                    <p className='text-xs text-slate-500'>
                      File upto 20MB
                    </p>
                  </div>
                </div>
              </div>

              {/* action buttons */}
              <div className='flex gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className='flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={uploading}
                  className='flex-1 h-11 px-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-hover-600 hover:to-teal-600 text-sm font-semibold rounded-xl transition-all durations-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {uploading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      Uploading...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      )}
    </div>
  );
}

export default DocumentList;