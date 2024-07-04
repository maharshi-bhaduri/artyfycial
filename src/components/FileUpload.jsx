import React, { useRef, useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const inputRef = useRef();

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const onChooseFile = () => {
    inputRef.current.click();
    setIsDisabled(false);
  };

  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFile(null);
    setProgress(0);
    setUploadStatus("select");
    setTitle("");
    setDescription("");
  };

  const handleUpload = async () => {
    if (uploadStatus === "done") {
      clearFileInput();
      return;
    }

    try {
      setUploadStatus("uploading");

      const formData = new FormData();
      const data = {
        artistId: localStorage.getItem("userId"),
        title,
        uploadDate: new Date().toISOString(),
        description,
        isActive: true,
        // path: "images",
        isPublic: true,
        clickCount: 0,
      };
      console.log(data);
      formData.append("image", selectedFile);
      formData.append("data", JSON.stringify(data));
      const response = await axios.post(
        import.meta.env.VITE_APP_ADD_IMAGE,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },

          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(percentCompleted);
            setProgress(percentCompleted);
          },
        }
      );

      setUploadStatus("done");
      setIsDisabled(true);
      console.log(
        "Image uploaded successfully and response is",
        JSON.stringify(response.data)
      );
    } catch (error) {
      setUploadStatus("select");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />

      {!selectedFile && (
        <button
          className="w-80 h-36 text-lg font-medium flex flex-col items-center justify-center gap-4 text-indigo-600 bg-white border border-indigo-600 border-dashed rounded-lg cursor-pointer transition-all duration-300 ease hover:bg-indigo-50"
          onClick={onChooseFile}
        >
          <span className="material-symbols-outlined w-12 h-12 text-3xl text-indigo-600 flex items-center justify-center rounded-full bg-indigo-100">
            upload
          </span>
          Upload File
        </button>
      )}

      {selectedFile && (
        <>
          <div className="w-72 flex items-center gap-4 text-black bg-white border border-indigo-200 rounded-md p-4">
            <span className="material-symbols-outlined text-2xl text-indigo-500">
              description
            </span>

            <div className="flex-1">
              <h6 className="text-sm font-normal">{selectedFile?.name}</h6>

              <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                <div
                  className="h-1 bg-indigo-600 rounded-full transition-width duration-500 ease"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {uploadStatus === "select" ? (
              <button
                className="w-9 h-9 flex items-center justify-center text-sm text-indigo-500 bg-indigo-100 rounded-full border-none"
                onClick={clearFileInput}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            ) : (
              <div className="w-9 h-9 flex items-center justify-center text-sm text-indigo-500 bg-indigo-100 rounded-full border-none">
                {uploadStatus === "uploading" ? (
                  `${progress}%`
                ) : uploadStatus === "done" ? (
                  <span className="material-symbols-outlined text-lg">
                    check
                  </span>
                ) : null}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-4 mt-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
              disabled={isDisabled}
              className="w-80 text-sm px-4 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
              disabled={isDisabled}
              className="w-80 h-24 text-sm px-4 py-2 border border-gray-300 rounded-lg resize-none"
            />
          </div>
          <button
            className="w-80 text-sm font-medium text-white bg-indigo-600 rounded-lg py-2 mt-4 cursor-pointer"
            onClick={handleUpload}
          >
            {uploadStatus === "select" || uploadStatus === "uploading"
              ? "Upload"
              : "Done"}
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
