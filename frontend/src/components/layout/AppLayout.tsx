import React from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { RenewModal } from "../modals/RenewModal";
import { ReminderModal } from "../modals/ReminderModal";
import { DeleteModal } from "../modals/DeleteModal";

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar (Figma 260px) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation (Figma 77px) */}
      <MobileNav />

      {/* Global Modals */}
      <RenewModal />
      <ReminderModal />
      <DeleteModal />
    </div>
  );
};
