import { Link } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";
import { LogOut, MessageCircle, User, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}, [theme]);

const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Convo</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                  className="sr-only"
                  aria-label="Toggle theme"
                />
                <div className="block bg-gray-700 w-12 h-7 rounded-full"></div>
                <div
                  className={`absolute left-1 top-1 w-5 h-5 rounded-full transition-transform duration-200
                    ${theme === "dark" ? "translate-x-5 bg-white" : "bg-yellow-300"}
                  `}
                >
                  {theme === "dark" ? (
                    <Moon className="w-4 h-4 m-auto text-gray-600" />
                  ) : (
                    <Sun className="w-4 h-4 m-auto text-yellow-600" />
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;