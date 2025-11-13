import ParentLayout from "@/components/layouts/ParentLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ParentLayout>{children}</ParentLayout>;
}
