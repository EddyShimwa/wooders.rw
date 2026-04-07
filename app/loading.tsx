import { LoadingLogo } from "@/components/ui/LoadingLogo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cream/80 backdrop-blur-md">
      <LoadingLogo size={120} text="Loading ..." />
    </div>
  );
}
