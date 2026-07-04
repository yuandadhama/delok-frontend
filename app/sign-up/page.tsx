"use client";

import { authClient } from "@/src/lib/auth-client";

const page = () => {
  const signInGoogle = async () => {
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000/dashboard",
    });

    console.log(result);
  };

  return (
    <div className=" flex justify-center items-center">
      <div className="w-full container bamber-300 ">
        <h1>Test login with google</h1>
        <button
          className="bg-blue-400 text-white p-6 rounded hover:opacity-80 cursor-pointer"
          onClick={signInGoogle}
        >
          Login with google
        </button>
      </div>
    </div>
  );
};

export default page;
