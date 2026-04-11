import { useState } from 'react';

const LogoImage = ({ className = "w-full h-full object-contain", alt = "Centrix Logo" }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const logoUrl = "https://res.cloudinary.com/bazeercloud/image/upload/q_auto/f_auto/v1775895427/ChatGPT_Image_Apr_11_2026_01_45_49_PM_trwcph.png";

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback to letter "M" if image fails to load
  if (imageError) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">M</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
      )}
      <img 
        src={logoUrl}
        alt={alt}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager" // Since it's preloaded, load immediately
      />
    </div>
  );
};

export default LogoImage;