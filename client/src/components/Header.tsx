import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-lg font-bold text-pink-700">Citizen<span className="text-gray-800">Gate</span></h1>
      <SignedOut>
        <SignInButton>
          <button className="bg-pink-700 text-white px-4 py-2 rounded-full">Login</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
