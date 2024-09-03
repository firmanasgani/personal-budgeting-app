import React from "react";

export const useAPI = <T>(url: string, method: "GET" | "POST" | "PUT" | "DELETE", data?: any) => {
  const [response, setResponse] = React.useState<T | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const token = localStorage.getItem("jwt");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const json = (await res.json()) as T;
      setResponse(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, method, data, token]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { response, error, loading };
};
