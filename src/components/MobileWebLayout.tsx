"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

type MobileWebLayoutProps = {
  children: React.ReactNode;
};

export default function MobileWebLayout({ children }: MobileWebLayoutProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "view-transition-name",
      "page-transition"
    );
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div
        key={pathname}
        style={{ viewTransitionName: "page" }}
        className="w-full max-w-[390px] h-[844px] bg-white shadow-xl flex flex-col relative rounded-[24px]"
      >
        {children}
      </div>
    </div>
  );
}
