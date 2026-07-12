// /app/dashboard/organization/[id]

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  console.log("fetching data");
  const response = await fetch(`http://localhost:8000/api/organization/${id}`, {
    credentials: "include",
  });
  console.log(`response: ${response}`);
  const data = await response.json();
  console.log(`data: ${JSON.stringify(data)}`);

  const { name } = data.data;

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
