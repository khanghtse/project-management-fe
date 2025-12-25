import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { userService } from "../../services/UserService";
import Card from "../../components/ui/Card";
import CardContent from "../../components/ui/CardContent";
import { Camera, Loader2, Lock, User } from "lucide-react";
import CardHeader from "../../components/ui/CardHeader";
import Label from "../../components/ui/Lable";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Form thông tin chung
  const {
    register: registerInfo,
    handleSubmit: submitInfo,
    setValue,
  } = useForm();

  // Form đổi mật khẩu
  const {
    register: registerPass,
    handleSubmit: submitPass,
    reset: resetPass,
    setError: setPassError,
    formState: { errors: passErrors },
  } = useForm();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getMe();
      setUser(data);
      setValue("name", data.name);
      setValue("phoneNumber", data.phoneNumber || ""); // Nếu có field này ở API
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateInfo = async (data) => {
    setLoading(true);
    try {
      await userService.updateProfile(data);
      toast.success("Cập nhật thông tin thành công!");
      loadProfile();
    } catch (error) {
      toast.error("Lỗi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview ngay lập tức (Optional)
    const previewUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, avatarUrl: previewUrl }));

    try {
      await userService.updateAvatar(file);
      toast.success("Đổi ảnh đại diện thành công!");
    } catch (error) {
      toast.error("Lỗi upload ảnh.");
      loadProfile(); // Revert nếu lỗi
    }
  };

  const handleChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setPassError("confirmPassword", {
        message: "Mật khẩu xác nhận không khớp",
      });
      toast.error("Mật khẩu xác nhận khóp nhau!");
      return;
    }

    try {
      await userService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      resetPass();
    } catch (error) {
      // Kiểm tra xem data trả về là String hay Object để lấy thông báo đúng
      const errorData = error.response?.data;
      const errorMessage =
        typeof errorData === "object"
          ? errorData.message || "Lỗi không xác định"
          : errorData || "Lỗi đổi mật khẩu (Sai mật khẩu cũ?)";
      toast.error(errorMessage);
    }
  };

  if (!user) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* --- CỘT TRÁI: AVATAR --- */}
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center p-6">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-4xl text-gray-400 font-bold">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    className="w-full h-full object-cover"
                    alt="Avatar"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              {/* Overlay Camera Icon */}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white w-8 h-8" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </CardContent>
        </Card>

        {/* --- CỘT PHẢI: FORMS --- */}
        <div className="md:col-span-2 space-y-6">
          {/* 1. Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User size={20} /> Thông tin cơ bản
              </h3>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={submitInfo(handleUpdateInfo)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Họ và tên</Label>
                    <Input {...registerInfo("name", { required: true })} />
                  </div>
                  <div>
                    <Label>Số điện thoại</Label>
                    <Input
                      {...registerInfo("phoneNumber")}
                      placeholder="0912..."
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="ghost" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 2. Bảo mật (Chỉ hiện nếu có password - tức là không phải Google Login) */}
          {/* Note: Backend trả về user dto chưa có cờ 'isGoogleAccount', bạn có thể check nếu password == null hoặc thêm field đó sau.
                Tạm thời cứ hiện, nếu gọi API lỗi thì backend sẽ chặn. */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Lock size={20} /> Đổi mật khẩu
              </h3>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={submitPass(handleChangePassword)}
                className="space-y-4"
              >
                <div>
                  <Label>Mật khẩu hiện tại</Label>
                  <Input
                    type="password"
                    {...registerPass("oldPassword", { required: true })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Mật khẩu mới</Label>
                    <Input
                      type="password"
                      {...registerPass("newPassword", {
                        required: true,
                        minLength: 6,
                      })}
                    />
                  </div>
                  <div>
                    <Label>Xác nhận mật khẩu</Label>
                    <Input
                      type="password"
                      {...registerPass("confirmPassword", { required: true })}
                    />
                    {passErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="outline">
                    Đổi mật khẩu
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
