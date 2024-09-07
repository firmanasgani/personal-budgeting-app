import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const data_card = ['Card 1', 'Card 2', 'Card 3']

  return (
    <Layout>
      <main className="tw-flex tw-flex-col tw-m-10">
        Dasboard works!
        <div className="tw-flex tw-flex-row tw-flex-wrap tw-gap-4 tw-mt-4 sm:tw-gap-2">
          {
            data_card.map((data) => (
              <Card className="tw-w-[500px]" key={data}>
              <CardHeader>
                <CardTitle>{data}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="tw-flex tw-flex-row tw-justify-between tw-flex-wrap tw-gap-2 tw-w-full">
                  <div className="tw-bg-green-600 tw-text-white tw-p-2 tw- tw-rounded-lg hover:tw-bg-green-200 hover:tw-text-black tw-cursor-pointer">
                    Content 1
                  </div>
                  <div className="tw-bg-red-600 tw-text-white tw-p-2 tw- tw-rounded-lg hover:tw-bg-red-200 hover:tw-text-black tw-cursor-pointer">
                    Content 2
                  </div>
                  <div className="tw-bg-blue-600 tw-text-white tw-p-2 tw- tw-rounded-lg hover:tw-bg-blue-200 hover:tw-text-black tw-cursor-pointer">
                    Content 3
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          }
       
        </div>
      </main>
    </Layout>
  );
}
