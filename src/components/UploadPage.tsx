import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, Zap, Edit3, Rocket } from 'lucide-react';
import type { User } from '../App';
import Header from './ui/Header';
import Footer from './ui/Footer';
import Button from './ui/Button';
import Card from './ui/Card';

interface UploadPageProps {
  onUpload: (file: File) => void;
  user: User | null;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUpload, user }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setUploadedFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
  };

  const processUpload = () => {
    if (!uploadedFile) return;

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      onUpload(uploadedFile);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header user={user} showUserMenu={false} />

      <main className="flex-1">
        <div className="container-max section-padding">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold text-neutral-900 mb-4">
              Upload Your Resume
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Let Folio extract and organize your professional information automatically.
              We support PDF and DOCX formats.
            </p>
            {user && (
              <p className="text-primary-600 font-medium mt-4">
                Welcome, {user.name || user.email}
              </p>
            )}
          </div>

          <div className="mb-12">
            <Card variant="elevated" padding="spacious">
              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-neutral-300 hover:border-primary-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className={`p-4 rounded-full transition-all ${
                      dragActive
                        ? 'bg-primary-100 scale-110'
                        : 'bg-neutral-100'
                    }`}>
                      <Upload className={`w-8 h-8 transition-colors ${
                        dragActive ? 'text-primary-600' : 'text-neutral-400'
                      }`} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        Drag and drop your resume
                      </h2>
                      <p className="text-neutral-600 mb-6">
                        or click the button below to browse
                      </p>

                      <label className="cursor-pointer inline-block">
                        <div className="btn-primary inline-flex items-center justify-center gap-2">
                          <Upload className="w-5 h-5" />
                          Choose Resume File
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.docx,.doc"
                          onChange={handleFileInput}
                        />
                      </label>
                    </div>

                    <div className="text-sm text-neutral-500">
                      PDF or DOCX • Maximum 10 MB
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 bg-success-50 border border-success-200 rounded-xl p-4 mb-8">
                    <CheckCircle className="w-6 h-6 text-success-600 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold text-success-900">
                        File ready to parse
                      </div>
                      <div className="text-sm text-success-700">
                        {uploadedFile.name}
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="ml-4 p-1.5 hover:bg-success-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-5 h-5 text-success-600" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <FileText className="w-5 h-5 text-neutral-400" />
                    <span className="font-medium text-neutral-900">
                      {uploadedFile.name}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={processUpload}
                      isLoading={uploading}
                    >
                      <FileText className="w-5 h-5" />
                      {uploading ? 'Parsing...' : 'Parse Resume'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={removeFile}
                      disabled={uploading}
                    >
                      Choose Different File
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                  <p className="text-error-700 font-medium">{error}</p>
                </div>
              )}
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="default" padding="normal">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Smart Parsing
                </h3>
                <p className="text-neutral-600 text-sm">
                  Advanced AI extracts your experience, education, and skills automatically
                </p>
              </div>
            </Card>

            <Card variant="default" padding="normal">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mb-4">
                  <Edit3 className="w-6 h-6 text-success-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Easy Editing
                </h3>
                <p className="text-neutral-600 text-sm">
                  Review and refine extracted information with our intuitive interface
                </p>
              </div>
            </Card>

            <Card variant="default" padding="normal">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Ready to Share
                </h3>
                <p className="text-neutral-600 text-sm">
                  Transform your resume into a beautiful, professional portfolio
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadPage;