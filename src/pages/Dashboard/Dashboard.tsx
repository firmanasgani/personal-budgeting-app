import Layout from "@/components/layout/layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_URL_API
  console.log(API_URL)
  return (
    <Layout>
      <main className="tw-flex tw-flex-col tw-m-10">
        Dasboard works!
        <div className="tw-flex tw-flex-row tw-flex-wrap tw-gap-4 tw-mt-4">
          <Card className="tw-w-[240px]">
            <CardHeader>
              <CardTitle>
                Card title 1
              </CardTitle>

            </CardHeader>
          </Card>
          <Card className="tw-w-[240px]">
            <CardHeader>
              <CardTitle>
                Card title 1
              </CardTitle>

            </CardHeader>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
