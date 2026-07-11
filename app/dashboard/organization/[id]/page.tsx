const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="flex justify-center  w-full h-screen">
      <div className="w-full container flex flex-col gap-4 p-8">
        <h1>This is organization page of id: {id}</h1>
      </div>
    </div>
  );
};

export default page;
