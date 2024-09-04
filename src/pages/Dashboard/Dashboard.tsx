import Layout from "@/components/layout/layout";

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_URL_API
  console.log(API_URL)
  return (
    <Layout>
      <main className="tw-mb-auto tw-h-screen w-bg-green-500">
        Dasboard works!
        
      </main>
    </Layout>
  );
}
