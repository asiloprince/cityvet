import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface UserDetails {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
}

function Settings() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeScreen, setActiveScreen] = useState("account-general"); // Initial active screen

  const handleScreenChange = (screenId: string) => {
    setActiveScreen(screenId);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/accounts/user/details`,
          { withCredentials: true }
        );
        setUserDetails(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_PUBLIC_API_URL}/accounts/update/:user_id`,
        userDetails,
        { withCredentials: true }
      );
      alert("User details updated successfully!");
    } catch (error) {
      console.error("Failed to update user details:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_PUBLIC_API_URL}/accounts/delete/:user_id`,
        { withCredentials: true }
      );
      alert("User account deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user account:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDetails) {
    return <div>No user details available.</div>;
  }

  return (
    <div className="bg-gray-100 mt-8">
      <div className="container mx-auto p-5">
        <h4 className="font-bold py-3 mb-4 text-2xl">Account settings</h4>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex">
            <div className="w-1/4 border-r border-gray-300 p-4">
              <div className="space-y-2">
                <Link
                  className={`block px-4 py-3 ${
                    activeScreen === "account-general"
                      ? "bg-cyan-600 text-white font-bold"
                      : ""
                  }`}
                  to="#account-general"
                  onClick={() => handleScreenChange("account-general")}
                >
                  General
                </Link>
                <Link
                  className={`block px-4 py-3 border-t border-gray-300 ${
                    activeScreen === "account-change-password"
                      ? "bg-cyan-600 text-white font-bold"
                      : ""
                  }`}
                  to="#account-change-password"
                  onClick={() => handleScreenChange("account-change-password")}
                >
                  Change password
                </Link>
                <Link
                  className={`block px-4 py-3 border-t border-gray-300 ${
                    activeScreen === "account-info"
                      ? "bg-cyan-600 text-white font-bold"
                      : ""
                  }`}
                  to="#account-info"
                  onClick={() => handleScreenChange("account-info")}
                >
                  Delete Account
                </Link>
              </div>
            </div>
            <div className="w-3/4 p-4">
              <div className="m-auto h-96">
                {/* General Screen */}
                {activeScreen === "account-general" && (
                  <div className="p-4 rounded-lg shadow-md bg-white">
                    <div className="mb-6">
                      <label
                        htmlFor="firstname"
                        className="block text-gray-700 text-sm font-semibold"
                      >
                        Firstname
                      </label>
                      <input
                        id="firstname"
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        value={userDetails.first_name}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            first_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="lastname"
                        className="block text-gray-700 text-sm font-semibold"
                      >
                        Lastname
                      </label>
                      <input
                        id="lastname"
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        value={userDetails.last_name}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            last_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="email"
                        className="block text-gray-700 text-sm font-semibold"
                      >
                        E-mail
                      </label>
                      <input
                        id="email"
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        value={userDetails.email}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="roles"
                        className="block text-gray-700 text-sm font-semibold"
                      >
                        Roles
                      </label>
                      <input
                        id="roles"
                        type="text"
                        readOnly
                        className="w-full border border-gray-300 rounded p-2"
                        value={userDetails.role_name}
                      />
                    </div>
                  </div>
                )}
                {/* Change Password Screen */}
                {activeScreen === "account-change-password" && (
                  <form
                    // onSubmit={handleSubmit}
                    className="p-4 rounded-lg shadow-md bg-white"
                  >
                    <div className="mb-6">
                      <label
                        htmlFor="currentPassword"
                        className="block text-gray-700 text-sm font-semibold"
                      >
                        Current password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        className="w-full border border-gray-300 rounded p-2"
                        name="currentPassword"
                        // value={currentPassword}
                        // onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="newPassword"
                        className="block text-gray-700 text-sm font-semibold"
                      >
                        New password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        className="w-full border border-gray-300 rounded p-2"
                        name="newPassword"
                        // value={newPassword}
                        // onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="newPassword"
                        className="block text-gray-700 text-sm font-semibold"
                      >
                        Repeat New password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        className="w-full border border-gray-300 rounded p-2"
                        name="newPassword"
                        // value={newPassword}
                        // onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-cyan-600 text-white rounded"
                    >
                      Update Password
                    </button>
                  </form>
                )}

                {/* Delete Account Screen */}
                {activeScreen === "account-info" && (
                  <div className="p-4 rounded-lg shadow-md bg-white">
                    <div className="flex flex-col bg-white">
                      <div className=" text-red-600 text-center text-xl font-bold py-4">
                        <h1>Delete account</h1>
                      </div>
                      <div className="flex-grow p-8">
                        <p className="text-black">
                          Once you delete your account, there is no going back.
                          Please be certain.
                        </p>
                      </div>
                      <div className="flex justify-end pb-4 pr-8">
                        <button className="bg-gray-200 text-red-600  border-red-600 py-2 px-4 rounded">
                          Delete your account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mt-2.5 pb-5">
          <button
            className="border text-red-600 border-red-600 hover:bg-red-600 hover:text-white text-sm px-4 py-2 rounded-md"
            onClick={handleUpdateUser}
          >
            Discard Changes
          </button>
          <button
            className="bg-green-500 text-white text-sm px-4 py-2 rounded-md ml-2"
            onClick={handleDeleteUser}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
