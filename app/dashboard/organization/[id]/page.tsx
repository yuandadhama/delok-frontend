// /app/dashboard/organization/[id]

// import { cookies } from "next/headers";

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  // const session = await cookies();

  const [name, setName] = useState("");
  const params = useParams();

  const { id } = params;

  const fetchData = async () => {
    try {
      console.log("fetching data");
      const response = await fetch(
        `http://localhost:8000/api/organization/${id}`,
        {
          credentials: "include",
        },
      );
      console.log(`response: ${response}`);
      const data = await response.json();
      console.log(`data: ${JSON.stringify(data)}`);

      const { name } = data.data;

      setName(name);
    } catch (e) {
      console.log("organization not found");
    }
  };

  useEffect(() => {
    fetchData();
  });

  if (!name) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="flex justify-center  w-full h-screen">
      <div className="w-full container flex flex-col gap-4 p-8">
        <h1>This is organization page of id: {id}</h1>
        <h1>The name of organization is: {name}</h1>
      </div>
    </div>
  );
};

export default page;
