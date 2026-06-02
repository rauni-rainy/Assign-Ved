import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  showGridIcon?: boolean;
  headerIcon?: string;
  title?: string;
  activeTab?: string;
  primaryActionText?: string;
  primaryActionIcon?: string;
  primaryActionHref?: string;
}

export default function DashboardLayout({ 
  children, 
  showGridIcon = true,
  headerIcon = "grid_view",
  title = "Assignment",
  activeTab = "Assignments",
  primaryActionText = "Create Assignment",
  primaryActionIcon = "auto_awesome",
  primaryActionHref = "/create",
}: DashboardLayoutProps) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#E5E7EB]">
      {/* App Container */}
      <div className="w-full h-screen md:h-[843px] md:max-w-[1440px] bg-[#CECECE] md:bg-gradient-to-b md:from-[#EEEEEE] md:to-[#DADADA] flex md:gap-5 md:p-5 overflow-hidden relative">
        
        {/* Desktop Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          primaryActionText={primaryActionText}
          primaryActionIcon={primaryActionIcon}
          primaryActionHref={primaryActionHref}
        />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full md:gap-3 pb-16 md:pb-0 overflow-hidden relative">
          <div className="p-4 md:p-0 shrink-0">
            <Header showGridIcon={showGridIcon} headerIcon={headerIcon} title={title} />
          </div>
          
          {children}
        </main>
        
        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
