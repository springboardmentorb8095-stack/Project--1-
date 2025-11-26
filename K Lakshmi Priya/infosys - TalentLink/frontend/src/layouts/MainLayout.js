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
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar className="w-64" />

      {/* Main + Right Panel container */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar onOpenPanel={openPanel} />

        {/* Content + Right Panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          <main className="p-6 flex-1 overflow-auto transition-colors duration-300">
            <Outlet />
          </main>

          {/* Right Panel */}
          <div
            className={`bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-inner transition-all duration-300 overflow-y-auto ${
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
