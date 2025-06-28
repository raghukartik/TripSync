import React from "react";
import { useState, useRef, useEffect } from "react";
import { FaRegFileImage } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({ image, setImage, handleDeleteImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null); 
    handleDeleteImage();
  }

  const onChooseFile = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    // if the image prop is string, set it as the preview URL
    if (typeof image === "string") {
      setPreviewUrl(image);
    } else if (image) {
      // if the image prop is a file object, create a preview url
      setPreviewUrl(URL.createObjectURL(image));
    } else {
      // if there is no image , clear the preview url
      setPreviewUrl(null);
    }

    return () => {
      if (previewUrl && typeof previewUrl === "string" && !image) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [image]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50 cursor-pointer"
          onClick={() => onChooseFile()}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
            <FaRegFileImage className="text-xl text-cyan-500" />
          </div>
          <p className="text-sm text-slate-500">Browse image files to upload</p>
        </button>
      ) : (
        <>
          <div className="w-full relative">
            <img
              src={previewUrl}
              alt="selected"
              className="w-full h-[300px] object-cover rounded-lg"
            />
            <button className="bg-rose-50 text-rose-500 shadow-rose-100/0 border border-rose-100 hover:bg-rose-500 hover:text-white flex items-center gap-1 text-xs font-medium bg-cyan-50 text-cyan-400 shadow-md shadow-cyan-100 border border-cyan-100 hover:bg-cyan-400 hover:text-white rounded px-3 py-[3px] absolute top-2 right-2"
            onClick={handleRemoveImage}
            >
                <MdDeleteOutline className="text-lg"/>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSelector;
