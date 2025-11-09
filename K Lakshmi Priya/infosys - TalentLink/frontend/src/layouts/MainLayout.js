// src/layouts/MainLayout.js
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RightPanel from "../components/RightPanel";

export default function MainLayout() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState(null); // "profile" | "notifications"

  const openPanel = (type) => {
    setPanelType(type);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setPanelType(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar className="w-64 bg-gray-800 text-white" />

      {/* Main + Right Panel container */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar onOpenPanel={openPanel} />

        {/* Content + Right Panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          <main
            className={`p-6 bg-gray-100 flex-1 overflow-auto transition-all duration-300 `}
          >
            <Outlet />
          </main>

          {/* Persistent right-side space */}
          <div
            className={`bg-white border-l border-gray-200 shadow-inner transition-all duration-300 overflow-y-auto ${
              isPanelOpen ? "w-80" : "w-0"
            }`}
          >
            {isPanelOpen && (
              <RightPanel
                isOpen={isPanelOpen}
                type={panelType}
                onClose={closePanel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
