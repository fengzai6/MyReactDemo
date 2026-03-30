import { Outlet } from "react-router";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export const AppLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
