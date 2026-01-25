import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function Profile() {
  const {
    user,
    token,
    logout,
    navigate: contextNavigate,
    axios,
    fetchUser,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [uploadMethod, setUploadMethod] = useState(null); // "url" or "file"
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [imagePreview, setImagePreview] = useState(user?.image || "");
  const [editName, setEditName] = useState(user?.name || "");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Redirect to home if not logged in
    if (!token || !user) {
      navigate("/");
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (user?.image) {
      setImageUrl(user.image);
      setImagePreview(user.image);
    }
    if (user?.name) {
      setEditName(user.name);
    }
  }, [user]);

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleImageUpload = async () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    try {
      setIsUploading(true);
      const { data } = await axios.post(
        "/api/user/update-image",
        { image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success("Profile image updated successfully");
        await fetchUser();
        setIsEditingImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setImageUrl(user?.image || "");
    setImagePreview(user?.image || "");
    setIsEditingImage(false);
    setUploadMethod(null);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post("/api/user/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Profile image uploaded successfully");
        await fetchUser();
        setIsEditingImage(false);
        setUploadMethod(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveName = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsUploading(true);
      const { data } = await axios.post(
        "/api/user/update-name",
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success("Name updated successfully");
        await fetchUser();
        setIsEditingName(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update name");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelName = () => {
    setEditName(user?.name || "");
    setIsEditingName(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-center">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="px-6 py-8 space-y-6">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-4 border-blue-500">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              {!isEditingImage && (
                <button
                  onClick={() => setIsEditingImage(true)}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Image Edit Form */}
          {isEditingImage && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-4 border border-blue-200">
              {!uploadMethod ? (
                <>
                  <p className="text-sm font-medium text-gray-700">
                    Choose upload method:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setUploadMethod("url")}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                    >
                      📎 Paste URL
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                    >
                      📤 Upload File
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </>
              ) : uploadMethod === "url" ? (
                <>
                  <p className="text-sm font-medium text-gray-700">
                    Enter Image URL:
                  </p>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {imagePreview && (
                    <p className="text-xs text-gray-500">Preview updating...</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleImageUpload}
                      disabled={isUploading}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm font-medium transition-colors"
                    >
                      {isUploading ? "Updating..." : "Update"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isUploading}
                      className="flex-1 px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Get free image URLs from{" "}
                    <a
                      href="https://imgur.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Imgur
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://unsplash.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Unsplash
                    </a>
                  </p>
                </>
              ) : null}
            </div>
          )}

          {/* User Information */}
          <div className="space-y-4">
            {/* Name */}
            <div className="border-b pb-4">
              <p className="text-gray-600 text-sm font-medium mb-2 flex justify-between items-center">
                Full Name
                {!isEditingName && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    ✏️ Edit
                  </button>
                )}
              </p>
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isUploading}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelName}
                    disabled={isUploading}
                    className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-gray-900 text-lg font-semibold">
                  {user.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="border-b pb-4">
              <p className="text-gray-600 text-sm font-medium mb-1">
                Email Address
              </p>
              <p className="text-gray-900 text-lg">{user.email}</p>
            </div>

            {/* Role */}
            <div className="border-b pb-4">
              <p className="text-gray-600 text-sm font-medium mb-1">Role</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {user.role === "owner" ? "Car Owner" : "User"}
                </span>
                {user.isAdmin && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Member Since */}
            <div className="pb-4">
              <p className="text-gray-600 text-sm font-medium mb-1">
                Member Since
              </p>
              <p className="text-gray-900 text-lg">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => navigate("/")}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Back Home
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
