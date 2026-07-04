import Link from "next/link";

const page = async () => {
  const users = await fetch("http://localhost:8000/api/user");
  const usersData = await users.json();
  return (
    <div>
      <h1>Test user api</h1>
      <ul>
        {usersData.data.map((user: any) => (
          <li key={user.id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>

      <Link href={"/sign-up"} className="underline text-blue-500">
        Go to sign up page
      </Link>
    </div>
  );
};

export default page;
