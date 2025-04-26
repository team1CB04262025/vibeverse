"use client";
import React from "react";

type MobileWebLayoutProps = {
  children: React.ReactNode;
};

export default function MobileWebLayout({ children }: MobileWebLayoutProps) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div
        className="w-full max-w-[390px] min-h-[844px] bg-white shadow-xl flex flex-col relative"
        style={{
          height: "844px", // iPhone 13/14 기준
          borderRadius: "24px", // 모바일 느낌 강조
        }}
      >
        {children}
      </div>
    </div>
  );
}
