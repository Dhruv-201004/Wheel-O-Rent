import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, token, logout, axios, fetchUser } = useContext(AppContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.image || "");
  const [editName, setEditName] = useState(user?.name || "");
  const [isUploading, setIsUploading] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {},
  });

  useEffect(() => {
    if (!token || !user) {
      navigate("/");
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (user?.image) {
      setImagePreview(user.image);
    }
    if (user?.name) {
      setEditName(user.name);
    }
  }, [user]);

  // Check password strength
  const checkPasswordStrength = (pwd) => {
    const requirements = {
      minLength: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*]/.test(pwd),
    };
    const score = Object.values(requirements).filter(Boolean).length;
    return { score, requirements };
  };

  const handleNewPasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    setPasswordStrength(checkPasswordStrength(pwd));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImagePreview(event.target?.result);
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post("/api/user/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success("Image uploaded");
        await fetchUser();
        setIsEditingImage(false);
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
      const { data } = await axios.post("/api/user/update-name", {
        name: editName,
      });
      if (data.success) {
        toast.success("Name updated");
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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const strength = checkPasswordStrength(newPassword);
    if (strength.score < 5) {
      toast.error("Password must meet all requirements");
      return;
    }
    try {
      setIsUploading(true);
      const { data } = await axios.post("/api/user/change-password", {
        currentPassword,
        newPassword,
      });
      if (data.success) {
        toast.success("Password changed successfully");
        setIsChangingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsUploading(false);
    }
  };

  const EyeIcon = ({ show, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer"
    >
      {show ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
            clipRule="evenodd"
          />
          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
        </svg>
      )}
    </button>
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center !p-3 sm:!p-4 md:!p-6 !py-6 md:!py-0">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header with Back & Logout */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 !px-3 sm:!px-4 !py-2 sm:!py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-white hover:text-blue-200 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 sm:w-5 h-4 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-xs sm:text-sm font-medium">Back</span>
          </button>
          <h1 className="text-base sm:text-lg font-bold text-white">
            My Profile
          </h1>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-1 text-white hover:text-red-200 transition-colors cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              Logout
            </span>
            <svg
              className="w-4 sm:w-5 h-4 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>

        {/* Profile Content */}
        <div className="!p-3 sm:!p-4 md:!p-6 space-y-3 md:space-y-4">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden border-3 border-blue-500 cursor-pointer hover:opacity-80 transition-opacity"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {!isEditingImage && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow cursor-pointer"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Image Edit */}
          {isEditingImage && (
            <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
                >
                  {isUploading ? "Uploading..." : "Choose Photo"}
                </button>
                <button
                  onClick={() => {
                    setIsEditingImage(false);
                    setImagePreview(user?.image || "");
                  }}
                  className="px-3 py-2 bg-gray-300 rounded text-xs font-medium hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="space-y-3">
            {/* Name */}
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Name</p>
                {isEditingName ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isUploading}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditName(user?.name || "");
                        setIsEditingName(false);
                      }}
                      className="px-2 py-1 bg-gray-300 rounded text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>
                )}
              </div>
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-blue-600 hover:text-blue-800 text-xs cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Email */}
            <div className="py-2 border-b">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{user.email}</p>
            </div>

            {/* Role */}
            <div className="py-2 border-b">
              <p className="text-xs text-gray-500">Role</p>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {user.role === "owner" ? "Car Owner" : "User"}
                </span>
                {user.isAdmin && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Member Since */}
            <div className="py-2 border-b">
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="pt-2">
            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full py-2 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors cursor-pointer"
              >
                🔒 Change Password
              </button>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                <p className="text-sm font-semibold text-gray-700">
                  Change Password
                </p>

                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                    className="w-full px-3 py-2 pr-8 border rounded text-sm"
                  />
                  <EyeIcon
                    show={showCurrentPassword}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  />
                </div>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    placeholder="New Password"
                    className="w-full px-3 py-2 pr-8 border rounded text-sm"
                  />
                  <EyeIcon
                    show={showNewPassword}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                </div>

                {/* Password Requirements */}
                {newPassword && (
                  <div className="bg-white p-2 rounded border space-y-1">
                    <p className="text-xs font-semibold text-gray-700">
                      Password Requirements:
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      <span
                        className={`text-xs ${passwordStrength.requirements?.minLength ? "text-green-600" : "text-gray-400"}`}
                      >
                        {passwordStrength.requirements?.minLength ? "✓" : "○"}{" "}
                        8+ characters
                      </span>
                      <span
                        className={`text-xs ${passwordStrength.requirements?.uppercase ? "text-green-600" : "text-gray-400"}`}
                      >
                        {passwordStrength.requirements?.uppercase ? "✓" : "○"}{" "}
                        Uppercase
                      </span>
                      <span
                        className={`text-xs ${passwordStrength.requirements?.lowercase ? "text-green-600" : "text-gray-400"}`}
                      >
                        {passwordStrength.requirements?.lowercase ? "✓" : "○"}{" "}
                        Lowercase
                      </span>
                      <span
                        className={`text-xs ${passwordStrength.requirements?.number ? "text-green-600" : "text-gray-400"}`}
                      >
                        {passwordStrength.requirements?.number ? "✓" : "○"}{" "}
                        Number
                      </span>
                      <span
                        className={`text-xs ${passwordStrength.requirements?.special ? "text-green-600" : "text-gray-400"}`}
                      >
                        {passwordStrength.requirements?.special ? "✓" : "○"}{" "}
                        Special (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full px-3 py-2 pr-8 border rounded text-sm"
                  />
                  <EyeIcon
                    show={showConfirmPassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>

                {newPassword &&
                  confirmNewPassword &&
                  newPassword !== confirmNewPassword && (
                    <p className="text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}

                <div className="flex gap-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={isUploading}
                    className="flex-1 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
                  >
                    {isUploading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                      setPasswordStrength({ score: 0, requirements: {} });
                    }}
                    className="flex-1 py-2 bg-gray-300 rounded text-sm font-medium hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
