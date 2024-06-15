import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ImageGallery.css";

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(Date.now()); // State to track last updated timestamp

    const fetchImages = async () => {
        try {
            const response = await axios.get(
                import.meta.env.VITE_APP_GET_GALLERY
            );
            setImages(response.data.files); // Store the fetched images in state
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        fetchImages(); // Fetch images on component mount
    }, [lastUpdated]); // Re-fetch images when lastUpdated changes

    return (
        <div className="images-container">
            {images.map((file) => (
                <img
                    key={file.name}
                    src={file.url}
                    alt={file.name}
                    className="image-item"
                />
            ))}
        </div>
    );
};

export default ImageGallery;
