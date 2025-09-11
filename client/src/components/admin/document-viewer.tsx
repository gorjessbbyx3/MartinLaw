
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, FileText, Image, File, X } from "lucide-react";
import type { Document } from "@shared/schema";

interface DocumentViewerProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewer({ document, isOpen, onClose }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (mimeType === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const canPreview = (mimeType: string) => {
    return mimeType.startsWith('image/') || 
           mimeType === 'application/pdf' || 
           mimeType === 'text/plain';
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/documents/${document.id}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              {getFileIcon(document.mimeType)}
              <span>{document.originalName}</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Document Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{document.category}</Badge>
              <span className="text-sm text-muted-foreground">
                {(document.size / 1024).toFixed(1)} KB
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(document.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Button onClick={handleDownload} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Document Preview */}
          <div className="border rounded-lg p-4 min-h-[400px]">
            {canPreview(document.mimeType) ? (
              <div className="w-full h-full">
                {document.mimeType.startsWith('image/') && (
                  <img 
                    src={`/api/documents/${document.id}/content`}
                    alt={document.originalName}
                    className="max-w-full max-h-[500px] object-contain mx-auto"
                  />
                )}
                {document.mimeType === 'application/pdf' && (
                  <iframe
                    src={`/api/documents/${document.id}/content`}
                    className="w-full h-[500px] border-0"
                    title={document.originalName}
                  />
                )}
                {document.mimeType === 'text/plain' && (
                  <div className="w-full h-[500px] overflow-auto">
                    <iframe
                      src={`/api/documents/${document.id}/content`}
                      className="w-full h-full border-0"
                      title={document.originalName}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <File className="h-16 w-16 mx-auto mb-4" />
                  <p>Preview not available for this file type</p>
                  <p className="text-sm">Click download to view the file</p>
                </div>
              </div>
            )}
          </div>

          {/* Document Description */}
          {document.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{document.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
