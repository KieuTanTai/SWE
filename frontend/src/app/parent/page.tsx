import ContentCard from "@/components/ContentCard";

export default function ParentDashboard() {
  return (
    <div className="flex-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <ContentCard title="Tổng quan con">
        {/* Nội dung cho Tổng quan con */}
        <div></div>
      </ContentCard>
      <ContentCard title="Trạng thái xe">
        {/* Nội dung cho Trạng thái xe */}
        <div></div>
      </ContentCard>
      <ContentCard title="Thông báo mới">
        {/* Nội dung cho Thông báo mới */}
        <div></div>
      </ContentCard>
    </div>
  );
}
