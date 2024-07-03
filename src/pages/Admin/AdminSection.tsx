import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components/generic/Header";
import { User } from "firebase/auth";
import { auth } from "../..";
import { useEffect, useState } from "react";

export const AdminSection = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const navigate = useNavigate();
  let location = useLocation();

  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     if (!user) {
  //       navigate("/login");
  //     } else {
  //       if (location.pathname === "/admin") navigate("home");
  //       setUser(user);
  //     }
  //   });
  //
  //   if (user && location.pathname === "/admin") navigate("home");
  // }, []);

  return (
    <>
      <Header user={user}></Header>
      <Outlet />
    </>
  );
};
