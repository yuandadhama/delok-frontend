import Link from "next/link";

const page = async () => {
  return (
    <div>
      <Link href={"/sign-up"} className="underline text-blue-500">
        Go to sign up page
      </Link>
    </div>
  );
};

export default page;
