import Link from "next/link";

import { ROUTES } from "@/src/constants/routes";

const page = async () => {
  return (
    <div>
      <Link href={ROUTES.AUTH.SIGN_UP} className="underline text-blue-500">
        Go to sign up page
      </Link>
    </div>
  );
};

export default page;
