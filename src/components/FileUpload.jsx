import React, { useRef, useState } from "react";

export default function FileUpload() {
  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select"); //select, uploading and done

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0)
      setSelectedFile(event.target.files[0]);
  };

  const onChooseFile = (event) => {
    inputRef.current.click();
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      {/* File input element with reference */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {/* Button to trigger input file dialog */}
      {!selectedFile && (
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 flex items-center"
          onClick={onChooseFile}
        >
          <span className="material-symbols-outlined mr-2">upload</span>
          Upload File
        </button>
      )}
      {/* Display file information and progress when selected */}
      {selectedFile && (
        <>
          <div className="bg-white p-4 rounded shadow-md mt-4 w-64">
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-2">
                description
              </span>
              <div className="flex-1">
                <h5 className="font-bold">{selectedFile.name}</h5>
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-blue-500 rounded"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              {/* Display clear button or upload progress/checkmark */}
              <button
                className="ml-2 text-red-500"
                onClick={() => setSelectedFile(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          {/** button to finalize upload or clear selection */}
          <button className="upload-btn" onClick={() => {}}>
            Upload
          </button>
        </>
      )}
    </div>
  );
}
