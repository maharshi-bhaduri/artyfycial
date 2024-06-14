import React, { useState } from "react";
import axios from "axios";

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    //console.log(event.target.files);
    setSelectedFile(event.target.files[0]);
  };
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const handleSubmit = async function (event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedFile);
    //console.log(formData.get("image"));
    try {
      const response = await axios.post(
        "http://localhost:3000/api/createImage",
        formData,
        {
          headers: headers,
        }
      );
      console.log(
        "Image uploaded successfully and resposne is",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.log("Error uploading image", error);
    }
  };
  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
}

export default ImageUpload;
