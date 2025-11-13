import ParentLayout from "@/components/layouts/ParentLayout";
import ScheduleList from "@/components/Schedule/ScheduleList";

export default function SchedulePage() {
  return (
    <div className="p-6 space-y-6">
      <ScheduleList />
    </div>
  );
}
