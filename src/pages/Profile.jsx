import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { BsEmojiSmile } from "react-icons/bs";

function Profile() {
  const { user } = useAuth();
  const [details, setDetails] = useState({
    name: "",
    bio: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    phone: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const db = getFirestore();
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setDetails(userSnapshot.data());
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const db = getFirestore();
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...details,
          email: user.email,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="flex gap-2 text-3xl font-bold mb-6">
        <BsEmojiSmile className="text-4xl"/> Welcome, <spam className="text-blue-500"> {details.name || user?.email}</spam>
      </h1>

    <div className="w-full flex gap-5 px-3 py-5 mb-3">
    <Link to="/Cart" className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 text-center">
      My Cart
    </Link>
    <Link to="/Order" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 text-center">
      My Orders
    </Link>
    <Link to="/Wishlist" className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 text-center">
      My Wishlist
    </Link>
    </div>

<hr></hr>

    <h1 className="font-bold text-3xl p-3 py-5">User Information : </h1>
      <form
        onSubmit={handleSubmit}
        className={`space-y-4 ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={details.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={details.gender === "Male"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={details.gender === "Female"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Female
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={details.gender === "Other"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Other
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Full Postal Address</label>
            <textarea
              name="address"
              placeholder="Full Postal Address"
              value={details.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={details.city}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">State</label>
            <input
              type="text"
              name="state"
              placeholder="State"
              value={details.state}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={details.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="px-5">
          <label className="block mb-1 font-medium">Bio</label>
          <textarea
            name="bio"
            placeholder="Bio"
            value={details.bio}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <br></br><br></br>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {isUpdating ? "Updating Profile..." : "Update Profile"}
        </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
