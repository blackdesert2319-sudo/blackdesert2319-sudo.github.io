import React, { useState, useRef } from 'react';
import { FileData, ProcessingStatus } from './types';
import FileUploader from './components/FileUploader';
import MarkdownViewer from './components/MarkdownViewer';
import { transcribeDocument } from './services/geminiService';
import { generateWordDocument, downloadBlob } from './services/wordExportService';
import { DocumentIcon, TrashIcon, CopyIcon, SparklesIcon, DownloadIcon } from './components/Icon';

const App: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Ref for the text editor
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setErrorMessage("Vui lòng tải lên file ảnh hoặc PDF.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB limit for Gemini
       setErrorMessage("File quá lớn. Vui lòng chọn file nhỏ hơn 20MB.");
       return;
    }

    setErrorMessage(null);
    setMarkdown("");
    setStatus(ProcessingStatus.UPLOADING);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      
      setFileData({
        file,
        previewUrl: file.type.startsWith('image/') ? result : '',
        base64,
        mimeType: file.type
      });
      setStatus(ProcessingStatus.IDLE);
    };
    reader.onerror = () => {
      setErrorMessage("Lỗi khi đọc file.");
      setStatus(ProcessingStatus.ERROR);
    };
    reader.readAsDataURL(file);
  };

  const handleTranscribe = async () => {
    if (!fileData) return;

    setStatus(ProcessingStatus.PROCESSING);
    setErrorMessage(null);

    try {
      const result = await transcribeDocument(fileData.base64, fileData.mimeType);
      setMarkdown(result);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Lỗi khi xử lý với AI. Vui lòng thử lại.");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const handleReset = () => {
    setFileData(null);
    setMarkdown("");
    setStatus(ProcessingStatus.IDLE);
    setErrorMessage(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      alert("Đã sao chép nội dung!");
    });
  };

  const handleDownloadWord = () => {
    if (!markdown) return;
    try {
      const blob = generateWordDocument(markdown);
      const filename = fileData?.file.name 
        ? `${fileData.file.name.split('.')[0]}_converted.doc` 
        : 'math_scan_output.doc';
      downloadBlob(blob, filename);
    } catch (e) {
      console.error("Export error:", e);
      alert("Có lỗi khi tạo file Word.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
             <span className="text-white font-bold text-xl">MathOCR</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Chuyển đổi Đề Thi Toán</h1>
            <p className="text-xs text-gray-500">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {status === ProcessingStatus.SUCCESS && (
            <>
              <button 
                onClick={handleDownloadWord}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <DownloadIcon /> Tải file Word
              </button>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CopyIcon /> Copy Latex
              </button>
            </>
          )}
          {fileData && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
            >
              <TrashIcon /> Làm mới
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-6 gap-6 flex flex-col md:flex-row">
        
        {/* Left Panel: Input / Preview */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ${status === ProcessingStatus.SUCCESS ? 'md:w-1/3' : 'md:w-full max-w-3xl mx-auto'}`}>
          {!fileData ? (
             <div className="h-full flex flex-col justify-center">
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold mb-2 text-center">Tải lên đề thi</h2>
                  <p className="text-center text-gray-500 mb-8">Hỗ trợ ảnh (JPG, PNG) hoặc file PDF</p>
                  <FileUploader onFileSelect={handleFileSelect} />
                  {errorMessage && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                      {errorMessage}
                    </div>
                  )}
               </div>
             </div>
          ) : (
            <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
               {/* File Header */}
               <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <DocumentIcon />
                    <span className="truncate text-sm font-medium text-gray-700">{fileData.file.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded uppercase">{fileData.mimeType.split('/')[1]}</span>
                  </div>
               </div>

               {/* Preview Area */}
               <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center p-4">
                  {fileData.mimeType.startsWith('image/') ? (
                    <img src={fileData.previewUrl} alt="Preview" className="max-w-full max-h-full object-contain shadow-lg rounded" />
                  ) : (
                    <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                      <div className="mx-auto w-16 h-16 text-red-500 mb-3">
                         <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                      </div>
                      <p className="font-medium text-gray-900">PDF Document</p>
                      <p className="text-sm text-gray-500">Preview not available for PDF.</p>
                    </div>
                  )}
               </div>

               {/* Action Area */}
               <div className="p-4 bg-white border-t border-gray-100">
                  <button 
                    onClick={handleTranscribe}
                    disabled={status === ProcessingStatus.PROCESSING}
                    className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-md
                      ${status === ProcessingStatus.PROCESSING 
                        ? 'bg-indigo-400 cursor-wait' 
                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:transform active:scale-95'
                      }
                    `}
                  >
                    {status === ProcessingStatus.PROCESSING ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý (có thể mất vài giây)...
                      </>
                    ) : (
                      <>
                        <SparklesIcon /> Bắt đầu chuyển đổi
                      </>
                    )}
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Right Panel: Editor / Results (Only visible if processing started or finished) */}
        {(status === ProcessingStatus.SUCCESS || status === ProcessingStatus.PROCESSING || markdown) && (
          <div className="flex-1 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up">
            <div className="flex border-b border-gray-100">
               <div className="flex-1 px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600 text-center border-r border-gray-200">
                  Markdown Editor
               </div>
               <div className="flex-1 px-4 py-3 bg-white text-sm font-medium text-indigo-600 text-center">
                  Live Preview
               </div>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
               {/* Raw Editor */}
               <div className="flex-1 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 relative">
                  <textarea
                    ref={editorRef}
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed"
                    placeholder="Kết quả sẽ hiển thị ở đây..."
                    spellCheck={false}
                  />
               </div>

               {/* Rendered View */}
               <div className="flex-1 h-1/2 md:h-full overflow-hidden relative bg-white">
                  {markdown ? (
                    <MarkdownViewer content={markdown} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-300">
                      <p>Kết quả hiển thị</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;