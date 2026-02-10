import { TenantLayout } from "@/app/components/layouts/layouts";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TenantLayout>{children}</TenantLayout>;
}
