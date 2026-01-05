import { Link } from "react-router-dom";
import { Header } from "../components/header/Header";
	import { FaLock } from 'react-icons/fa';

export function Unauthorized() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 p-4 rounded-full">
              <FaLock className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Unauthorized Access
          </h2>
          <p className="text-gray-500 mb-8">
            Sorry, you do not have permission to view this page. Please return
            to the home page.
          </p>

          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md transition duration-150"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
