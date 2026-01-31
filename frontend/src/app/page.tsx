import { getHealth } from "@/services/api";

export default async function Home() {
  let data: any = null;
  let error: string | null = null;

  try {
    data = await getHealth();
  } catch (e: any) {
    error = e?.message ?? "Unknown error";
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Blue Peach Web</h1>

      <h2>Backend health</h2>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </main>
  );
}
