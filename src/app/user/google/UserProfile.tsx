import Image from "next/image";
import { AuthUser } from "./page";

export default function UserProfile({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout: () => void;
}) {
  return (
    <div className="space-y-4">
      {user.picture ? (
        <Image
          src={user.picture}
          alt="User"
          width={64}
          height={64}
          className="rounded-full mx-auto"
        />
      ) : (
        <div className="w-16 h-16 bg-blue-100 flex justify-center items-center mx-auto rounded-full text-xl font-bold text-blue-600">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
      )}
      <h3>{user.name || user.email}</h3>
      <p>{user.email}</p>
      {user.loginMethod === "otp" && (
        <span className="inline-block text-green-600 text-sm bg-green-100 rounded-full px-2 py-1">
          Email Verified
        </span>
      )}
      <button
        onClick={onLogout}
        className="w-full bg-red-600 text-white py-2 rounded-lg"
      >
        Sign Out
      </button>
    </div>
  );
}
