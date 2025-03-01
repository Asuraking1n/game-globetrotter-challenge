"use client";

import { useState } from "react";
import { User } from "@/types";
import { generateShareImage } from "@/utils/imageGenerator";
import Image from "next/image";

interface ShareButtonProps {
  user: User;
}

const ShareButton = ({ user }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const generateShareLink = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}?invite=${encodeURIComponent(user.username)}`;
  };

  const shareLink = generateShareLink();

  const handleShare = async () => {
    setIsOpen(true);

    if (!shareImage) {
      setIsGeneratingImage(true);
      try {
        const imageUrl = await generateShareImage(user.username, user.score);
        setShareImage(imageUrl);
      } catch (error) {
        console.error("Error generating share image:", error);
      } finally {
        setIsGeneratingImage(false);
      }
    }
  };

  const handleWhatsAppShare = () => {
    const text = `I've scored ${user.score.correct} correct answers in Globetrotter! Can you beat me? ${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
    setIsOpen(false);
  };

  const handleDownloadImage = () => {
    if (!shareImage) return;

    const link = document.createElement("a");
    link.href = shareImage;
    link.download = `globetrotter-challenge-${user.username}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
      >
        Challenge a Friend
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white p-4 rounded-lg shadow-lg z-10 w-80">
          <h3 className="font-bold mb-2">Share with friends</h3>
          <p className="text-sm mb-3">
            Your score: {user.score.correct} correct, {user.score.incorrect}{" "}
            incorrect
          </p>

          {isGeneratingImage ? (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-3">
              <p>Generating image...</p>
            </div>
          ) : shareImage ? (
            <div className="mb-3">
              <div className="relative w-full h-40 mb-2">
                <Image
                  src={shareImage}
                  alt="Share image"
                  fill
                  className="rounded-lg object-contain"
                  unoptimized
                />
              </div>
              <button
                onClick={handleDownloadImage}
                className="w-full bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-600 transition duration-200 text-sm mb-2"
              >
                Download Image
              </button>
            </div>
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-3">
              <p>Failed to generate image</p>
            </div>
          )}

          <button
            onClick={handleWhatsAppShare}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 mb-2"
          >
            Share on WhatsApp
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Copy Link
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
