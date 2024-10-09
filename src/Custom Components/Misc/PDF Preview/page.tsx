'use client';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PdfPreviewerProps {
  pdfUrl: string | null;
  onClose: () => void;
}

if (typeof Promise.withResolvers === 'undefined') {
    if (window)
        // @ts-expect-error This does not exist outside of polyfill which this is doing
        window.Promise.withResolvers = function () {
            let resolve, reject;
            const promise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            return { promise, resolve, reject };
        };
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

export const PdfPreviewer = ({ pdfUrl, onClose }: PdfPreviewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [dialogWidth, setDialogWidth] = useState<number | string>('90vw');
  const [scale, setScale] = useState(1);
  const [defaultWidth, setDefaultWidth] = useState<number | null>(null);
  // const [pdfText, setPdfText] = useState<string>('');
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = ({ width }: { width: number }) => {
    if (!defaultWidth) {
      const newWidth = width + 80;
      setDialogWidth(newWidth);
      setDefaultWidth(newWidth);
    }
  };

  // const onPageRenderSuccess = async (page: any) => {
  //   // const textContent = await page.getTextContent();
  //   // const pageText = textContent.items.map((item: { str: string }) => item.str).join('');
  //   // setPdfText(pageText);
  // };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) =>
      Math.min(Math.max(1, prevPageNumber + offset), numPages || 1)
    );
  };

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  const zoomOut = () => {
    if (defaultWidth) {
      const currentWidth = defaultWidth * scale;
      if (currentWidth > defaultWidth) {
        setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
      }
    }
  };

  return (
    <Dialog open={!!pdfUrl} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-full" style={{ width: dialogWidth }}>
        <DialogHeader>
          <DialogTitle>PDF Preview</DialogTitle>
        </DialogHeader>
        <div ref={pdfContainerRef} className="h-[70vh] overflow-auto">
          {error ? (
            <p>Error: {error}</p>
          ) : pdfUrl ? (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => {
                console.error('Error loading PDF:', error);
                setError('Error loading PDF: ' + error.message);
              }}
            >
              <Page
                pageNumber={pageNumber}
                onLoadSuccess={onPageLoadSuccess}
                // onRenderSuccess={onPageRenderSuccess}
                scale={scale}
              />
            </Document>
          ) : (
            <p>Loading PDF...</p>
          )}
        </div>
        <DialogFooter className="flex justify-between items-center">
          <div className="mr-4">
            {numPages && (
              <h3>
                Page {pageNumber} of {numPages}
              </h3>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={zoomOut}
              disabled={!defaultWidth || defaultWidth * scale <= defaultWidth}
              style={{ marginRight: '8px' }}
            >
              Zoom Out
            </Button>
            <Button
              onClick={zoomIn}
              disabled={scale >= 2}
              style={{ marginRight: '8px' }}
            >
              Zoom In
            </Button>
            <Button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1 || !!error}
              style={{ marginRight: '8px' }}
            >
              Previous
            </Button>
            <Button
              onClick={() => changePage(1)}
              disabled={pageNumber >= (numPages || 1) || !!error}
              style={{ marginRight: '8px' }}
            >
              Next
            </Button>
          </div>
          <Button onClick={onClose} className="ml-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};