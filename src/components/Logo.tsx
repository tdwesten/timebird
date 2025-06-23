import React from "react";
import logoOutline from "@/assets/logo-outline.svg";

export function Logo() {
  return (
    <div className="flex items-center justify-center bg-blue-600 w-10 h-10 rounded-md">
      <img 
        src={logoOutline} 
        alt="Timebird Logo" 
        className="w-8 h-8" 
        style={{ filter: "brightness(0) invert(1)" }} // Makes the SVG white
      />
    </div>
  );
}
