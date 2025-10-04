import { ROUTES } from "@constants/route";
import { Link } from "react-router-dom";
import { Button } from "@ui/Button";

const LoginPage = () => {
    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-secondary">
                    Đăng nhập
                </h1>
            </div>
            <form className="space-y-6">
                <div>
                    <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Nhập email của bạn"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Nhập mật khẩu của bạn"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full px-4 py-3 font-bold text-white bg-secondary rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                    Đăng nhập
                </Button>
            </form>
            <div className="flex items-center justify-between text-sm">
                <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="font-medium text-tertiary hover:underline">
                    Quên mật khẩu?
                </Link>
                <div className="flex items-center">
                    <span className="text-gray-500">Chưa có tài khoản?</span>
                    <Link to={ROUTES.AUTH.REGISTER} className="ml-1 font-medium text-tertiary hover:underline">
                        Đăng ký
                    </Link>
                </div>
            </div>
        </>
    );
};

export default LoginPage;