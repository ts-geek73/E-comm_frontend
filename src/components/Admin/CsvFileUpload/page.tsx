import apiServer from "@/lib/axios";
import { AxiosProgressEvent } from "axios";
import Papa, { ParseResult } from "papaparse";
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { renderDataTable } from "./renderFieldValue";
export const allowedExtensions = ["csv", "xlsx", "xls"];
export interface RowData {
  [key: string]: string | number | boolean | null;
}

export interface LoadingState {
  parsing: boolean;
  uploading: boolean;
}

const FileUpload = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [backData, setbackData] = useState<RowData[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<LoadingState>({
    parsing: false,
    uploading: false,
  });
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setError("Invalid file format. Only CSV, XLSX, XLS allowed.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading((prev) => ({ ...prev, parsing: true }));
    setShow(false);
    setUploadComplete(false);

    if (fileExtension === "csv") {
      Papa.parse<RowData>(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (result: ParseResult<RowData>) => {
          setLoading((prev) => ({ ...prev, parsing: false }));
          if (result.errors.length > 0) {
            setError(
              `CSV parsing errors: ${result.errors.map((e) => e.message).join(", ")}`
            );
            return;
          }
          setData(result.data);
          setShow(true);
          setSuccess(
            `Successfully parsed ${result.data.length} rows from CSV file.`
          );
          // console.log("Parsed CSV Data:", result.data);
        },
        error: (error) => {
          setLoading((prev) => ({ ...prev, parsing: false }));
          setError(`Failed to parse CSV: ${error.message}`);
        },
      });
    } else {
      const reader = new FileReader();

      reader.onload = (evt) => {
        try {
          // console.log("🚀 ~ handleFileChange ~ evt:", evt);
          const bstr = evt.target?.result;
          if (!bstr || typeof bstr !== "string") {
            setLoading((prev) => ({ ...prev, parsing: false }));
            setError("Failed to read the file.");
            return;
          }

          const workbook = XLSX.read(bstr, { type: "binary" });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const jsonData = XLSX.utils.sheet_to_json<RowData>(worksheet);

          setLoading((prev) => ({ ...prev, parsing: false }));
          setData(jsonData);
          setShow(true);
          setSuccess(
            `Successfully parsed ${jsonData.length} rows from Excel file.`
          );
          // console.log("🚀 ~ handleFileChange ~ jsonData:", jsonData);
        } catch (err) {
          setLoading((prev) => ({ ...prev, parsing: false }));
          setError(
            `Failed to parse Excel file: ${err instanceof Error ? err.message : "Unknown error"}`
          );
        }
      };

      reader.onerror = () => {
        setLoading((prev) => ({ ...prev, parsing: false }));
        setError("Failed to read the file.");
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleFileImport = (fileData: File) => {
    // console.log("🚀 ~ handleFileImport ~ fileData:", fileData);

    setLoading((prev) => ({ ...prev, uploading: true }));
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", fileData);

    apiServer
      .post("/product/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onDownloadProgress: async (progressEvent: AxiosProgressEvent) => {
          const { loaded, total } = progressEvent;
          console.log("🚀 ~ handleFileImport ~ progressEvent:", progressEvent);
          if (total) {
            const percentCompleted = (loaded * 100) / total;
            console.log(
              "🚀 ~ onDownloadProgress: ~ percentCompleted:",
              percentCompleted
            );
            setUploadProgress(percentCompleted);
          }
        },
      })
      .then((value) => {
        setLoading((prev) => ({ ...prev, uploading: false }));
        // console.log("🚀 ~ handleFileImport ~ value:", value.data.data);
        setbackData(value.data.data);
        setUploadProgress(null);
        setUploadComplete(true);
        setSuccess(
          `Successfully uploaded and processed ${value.data.data.length} records.`
        );
      })
      .catch((error) => {
        setLoading((prev) => ({ ...prev, uploading: false }));
        setUploadProgress(null);
        console.log("🚀 ~ handleFileImport ~ error:", error);
        setError(error.response?.data?.error || "File upload failed");
      });
  };

  const resetForm = () => {
    setData([]);
    setbackData([]);
    setError("");
    setSuccess("");
    setShow(false);
    setUploadProgress(null);
    setLoading({ parsing: false, uploading: false });
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto">
      <div className="bg-white ">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Upload</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select CSV or Excel file
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={loading.parsing || loading.uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
        </div>

        {/* Loading States */}
        {loading.parsing && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Parsing file...</span>
            </div>
          </div>
        )}

        {loading.uploading && (
          <div className="py-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="text-gray-600">Uploading to server...</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all ease-linear"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="text-green-800 text-sm">{success}</div>
            </div>
          </div>
        )}

        {data.length > 0 && show && !uploadComplete && (
          <>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  const file = fileInputRef.current?.files?.[0];
                  if (file) {
                    handleFileImport(file);
                  }
                }}
                disabled={loading.uploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading.uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload & Process</span>
                )}
              </button>
              <button
                onClick={resetForm}
                disabled={loading.uploading}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            {renderDataTable(data, "File Preview")}
          </>
        )}

        {/* Backend Response Data */}
        {backData.length > 0 && uploadComplete && (
          <>
            {renderDataTable(backData, "Upload Results")}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Upload Another File
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
