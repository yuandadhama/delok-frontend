import Button from "@/src/component/ui/Button";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <h1>Email verified successfully</h1>
      <p>You can now sign in to Delok.</p>
      <Link href={"/sign-in"}>
        <Button className="bg-blue-600">Sign In</Button>
      </Link>
    </div>
  );
};

export default page;
