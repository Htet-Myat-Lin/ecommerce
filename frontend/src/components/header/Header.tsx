import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";

import logoImage from "../../assets/logo.png";
import { useAuthStore } from "../../store/authStore";
import { useLogoutMutation } from "../../hooks/mutations";
import { useModalStore } from "../../store/modalStore";
import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Bell } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useNotificationStore } from "../../store/notificationStore";

export function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { mutate } = useLogoutMutation(() => navigate("/"));
  const { getTotalQuantity } = useCartStore();
  const { unreadCount } = useNotificationStore();
  const logout = () => {
    mutate();
  };
  const setOpenLoginModal = useModalStore((state) => state.setOpenLoginModal);

  return (
    <div className="w-full z-50 sticky top-0 bg-white">
      <Navbar fluid rounded className="max-w-7xl mx-auto">
        <NavbarBrand>
          <img
            src={logoImage}
            className="mr-1 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            ShweTech
          </span>
        </NavbarBrand>
        <div className="flex md:order-2 items-center gap-2">
          <div className="relative inline-flex items-center p-3">
            <ShoppingCart
              className="text-slate-600"
              size={22}
              onClick={() => navigate("/cart")}
            />
            <div
              onClick={() => navigate("/cart")}
              className="absolute top-2 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white shadow-sm cursor-pointer"
            >
              {getTotalQuantity()}
            </div>
          </div>
          {user && (
            <div className="relative">
              <Bell
                className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer"
                onClick={() => navigate("/notifications")}
              />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white shadow-sm">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
              )}
            </div>
          )}
          {user ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                user.profilePictures?.length ? (
                  <Avatar
                    alt="User settings"
                    img={user.profilePictures[0]}
                    rounded
                  />
                ) : (
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )
              }
            >
              <DropdownHeader>
                <span className="block text-sm">{user.username}</span>
                <span className="block truncate text-sm font-medium">
                  {user.email}
                </span>
              </DropdownHeader>
              <DropdownItem onClick={() => navigate("/admin/dashboard")}>
                Dashboard
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={logout}>Sign out</DropdownItem>
            </Dropdown>
          ) : (
            <Button
              onClick={() => {
                navigate("/");
                setOpenLoginModal(true);
              }}
            >
              Login
            </Button>
          )}
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block py-2 px-3 rounded md:p-0 font-medium transition-all ${
                isActive
                  ? "text-blue-700 bg-blue-50 md:bg-transparent md:text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block py-2 px-3 rounded md:p-0 font-medium transition-all ${
                isActive
                  ? "text-blue-700 bg-blue-50 md:bg-transparent md:text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600"
              }`
            }
          >
            Products
          </NavLink>
        </NavbarCollapse>
      </Navbar>
    </div>
  );
}
