import React, { useEffect, useState } from "react";
import axios from "axios";
import CachedImage from "./CachedImage";

const ImageGallery = () => {
    const [images, setImages] = useState([]);

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
    }, []);

    return (
        <div className="flex justify-end items-center">
            <div className="grid grid-cols-3 gap-8 px-16">
                {images.map((file) => (
                    <CachedImage
                        key={file.name}
                        src={file.url}
                        alt={file.name}
                        className="w-48 h-48 object-cover rounded grayscale hover:grayscale-0 transition-all duration-500"
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
