import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome to DevSync
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Your one-stop solution for developer collaboration.
          </p>
          <Image
            src="/logo.png"
            alt="Welcome Image"
            width={400}
            height={300}
            className="mx-auto mb-6"
          />
          <div className="flex justify-center space-x-4">
            <a
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Login
            </a>
            <a
              href="/register"
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
