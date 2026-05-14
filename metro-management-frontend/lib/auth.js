export const saveAuthData = (accessToken, user) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const redirectByRole = (role, router) => {
  if (role === "admin") {
    router.push("/admin/dashboard");
  } else if (role === "staff") {
    router.push("/staff/dashboard");
  } else if (role === "passenger") {
    router.push("/passenger/dashboard");
  } else {
    router.push("/login");
  }
};