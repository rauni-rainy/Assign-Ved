import DashboardLayout from "@/components/DashboardLayout";

export default function NotificationsPage() {
  return (
    <DashboardLayout title="Notifications">
      <div className="flex-1 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-400">No New Notifications</h2>
      </div>
    </DashboardLayout>
  );
}
