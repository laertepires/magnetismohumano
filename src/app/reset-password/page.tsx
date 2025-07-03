import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando…</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}