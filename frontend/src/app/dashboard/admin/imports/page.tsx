"use client";

import { useEffect, useState, useRef } from "react";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ImportPreview, ImportRecord } from "@/types";

export default function AdminImportsPage() {
  const { data: historyData, loading: historyLoading, execute: executeHistory } = useApi<ImportRecord[]>();
  const { execute: executePreview, loading: previewLoading } = useApi<ImportPreview>();
  const { execute: executeConfirm, loading: confirmLoading } = useApi<any>();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    executeHistory("GET", "/imports");
  }, [executeHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await executePreview("POST", "/imports/preview", formData);
      setPreview(res);
    } catch (err) {
      // handled by useApi
    }
  };

  const handleConfirm = async () => {
    if (!preview) return;
    try {
      const res = await executeConfirm("POST", "/imports/confirm", preview);
      toast({
        title: "Import Successful",
        description: `Successfully imported ${res.success} rows.`,
        variant: "default"
      });
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      executeHistory("GET", "/imports");
    } catch (err) {
      // handled by useApi
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Data Imports</h1>
        <p className="text-muted-foreground">Upload and manage student profile data via Excel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Upload Excel File</CardTitle>
            <CardDescription>Upload student data. Ensure it matches the required template format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors border-muted-foreground/20">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-1">Drag and drop or click to select</p>
              <p className="text-xs text-muted-foreground mb-4">.xlsx, .xls up to 10MB</p>
              <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()} size="sm">
                Browse Files
              </Button>
            </div>
            {file && (
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card text-sm">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                </div>
                <span className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
            <Button variant="outline" size="sm">Download Template</Button>
            <Button size="sm" onClick={handleUpload} disabled={!file || previewLoading} className="shadow-sm">
              {previewLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
              Preview Import
            </Button>
          </CardFooter>
        </Card>

        {preview ? (
          <Card className="border-border/50 shadow-sm border-primary/20 bg-primary/5 animate-in slide-in-from-right-4">
            <CardHeader>
              <CardTitle>Import Preview</CardTitle>
              <CardDescription>Review the data before committing to the database.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-background rounded-lg border flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold">{preview.total_rows}</span>
                  <span className="text-xs text-muted-foreground">Total Rows</span>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex flex-col items-center justify-center text-center text-emerald-600">
                  <span className="text-2xl font-bold">{preview.valid_rows}</span>
                  <span className="text-xs">Valid</span>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20 flex flex-col items-center justify-center text-center text-destructive">
                  <span className="text-2xl font-bold">{preview.invalid_rows}</span>
                  <span className="text-xs">Invalid</span>
                </div>
              </div>
              
              {preview.invalid_rows > 0 && (
                <Alert variant="destructive" className="mb-4 text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {preview.invalid_rows} rows have errors and will be skipped.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="text-sm font-medium mb-2">Data Sample (First 3 rows)</div>
              <div className="rounded-md border bg-background overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.preview_data.slice(0, 3).map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs text-muted-foreground">{row.row_num}</TableCell>
                        <TableCell className="text-xs font-medium">{row.data["Full Name"] || "-"}</TableCell>
                        <TableCell className="text-xs">{row.data["Email"] || "-"}</TableCell>
                        <TableCell>
                          {row.is_valid ? 
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Valid</Badge> : 
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Error</Badge>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-4 border-t bg-background/50">
              <Button onClick={handleConfirm} disabled={confirmLoading || preview.valid_rows === 0}>
                {confirmLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Import"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-border/50 shadow-sm opacity-50 bg-muted/20">
            <CardHeader>
              <CardTitle>Import Preview</CardTitle>
              <CardDescription>Upload a file to see the preview here.</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Waiting for file upload...</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-border/50 shadow-sm mt-8">
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>Recent data imports and their status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="pl-6">File Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Rows</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="pl-6 font-medium text-sm flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    {record.filename}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(record.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">{record.total_rows}</TableCell>
                  <TableCell className="text-sm text-emerald-600 font-medium">+{record.success_rows}</TableCell>
                  <TableCell>
                    {record.status === "Success" && <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 shadow-none"><CheckCircle2 className="w-3 h-3 mr-1"/> Success</Badge>}
                    {record.status === "Partial" && <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 shadow-none"><AlertCircle className="w-3 h-3 mr-1"/> Partial</Badge>}
                    {record.status === "Failed" && <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 shadow-none"><XCircle className="w-3 h-3 mr-1"/> Failed</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
