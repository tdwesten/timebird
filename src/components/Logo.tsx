import React from "react";
import logoOutline from "@/assets/logo-outline.svg";

export function Logo() {
  return (
    <div className=" flex items-center justify-center bg-blue-600 w-8 h-8 rounded-md">
      <img 
        src={logoOutline} 
        alt="Timebird Logo" 
        className="w-9 h-9"
        style={{ filter: "brightness(0) invert(1)" }} // Makes the SVG white
      />
    </div>
  );
}
