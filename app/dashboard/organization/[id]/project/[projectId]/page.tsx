// app/dashboard/organization/[id]/project/[projectId]

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ApiKey = {
  key: string;
};
const page = () => {
  const params = useParams<{ id: string; projectId: string }>();

  const { projectId } = params;

  const [projectName, setProjectName] = useState("");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/project/${projectId}`,
        {
          credentials: "include",
        },
      );

      const result = await response.json();
      console.log(JSON.stringify(result.data));
      const { name, apiKeys } = result.data;
      setProjectName(name);

      setApiKeys(apiKeys);
    } catch (e) {
      console.error("project not found");
    }
  };

  useEffect(() => {
    if (!projectId) return;

    fetchData();
  }, [projectId]);

  return (
    <div className="flex justify-center  w-full h-screen">
      <div className="w-full container flex flex-col gap-4 p-8">
        <h1>This is Project of id: {projectId}</h1>
        <h1>The name of Project is: {projectName}</h1>
        <h2>Api Key: </h2>
        <ul>
          {apiKeys.map((apiKey: ApiKey) => (
            <li key={apiKey.key}>{apiKey.key}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default page;
