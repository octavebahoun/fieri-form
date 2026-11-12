import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui";
import {
  isAdminAuthenticated,
  isAdminConfigured,
} from "@/lib/admin-auth";
import { listResponses } from "@/lib/responses";
import { computeStats } from "@/lib/scoring";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    return <AdminLogin configured={isAdminConfigured()} />;
  }

  const listed = await listResponses();
  if (!listed.ok) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-lg px-4 py-8">
        <Logo size="sm" />
        <Card className="mt-6 space-y-3">
          <h1 className="text-xl font-semibold">Admin connecté, données indisponibles</h1>
          <p className="text-sm text-muted">
            Impossible de lire Firestore pour le moment. Vérifie{" "}
            <code className="text-text">FIREBASE_SERVICE_ACCOUNT</code> (JSON brut
            ou base64) sur Vercel.
          </p>
          <p className="text-sm text-error">{listed.reason}</p>
          <p className="text-xs text-muted">
            Pour une démo locale avec données factices :{" "}
            <code className="text-text">USE_MOCK_DATA=true</code>.
          </p>
        </Card>
      </main>
    );
  }

  const stats = computeStats(listed.responses);
  return <AdminDashboard stats={stats} source={listed.source} />;
}
