// /app/dashboard/organization/[id]
"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
};
const page = () => {
  // const session = await cookies();

  const [name, setName] = useState("");
  const [projectName, setProjectName] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const params = useParams<{ id: string }>();

  const id = params.id;

  const fetchOrganizationData = async () => {
    try {
      console.log("fetching data");
      const response = await fetch(
        `http://localhost:8000/api/organization/${id}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      const { name } = data.data;

      setName(name);
    } catch (e) {
      console.log("organization not found");
    }
  };

  const fetchProjectData = async () => {
    try {
      console.log("fetching data project");
      const response = await fetch(
        `http://localhost:8000/api/project/organization/${id}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      const projects = data.data;
      setProjects(projects);
    } catch (e) {
      console.log("projects not found");
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchOrganizationData();
    fetchProjectData();
  }, [id]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log("submit clicked");
      const response = await fetch("http://localhost:8000/api/project", {
        method: "post",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          organizationId: id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProjectName("");
        await fetchProjectData();
      }
      console.log("response create project: " + JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  if (!name) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="flex justify-center  w-full h-screen">
      <div className="w-full container flex flex-col gap-4 p-8">
        <h1>This is organization page of id: {id}</h1>
        <h1>The name of organization is: {name}</h1>

        <form onSubmit={handleSubmit}>
          <Input
            label="Create New project"
            name="name"
            placeholder="organization name"
            onChange={(e) => setProjectName(e.target.value)}
            value={projectName}
          />
          <Button className="bg-green-600 mt-4">create</Button>
        </form>

        <h2 className="text-2xl font-bold">Projects in {name}</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/dashboard/organization/${id}/project/${project.id}`}
              >
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default page;
