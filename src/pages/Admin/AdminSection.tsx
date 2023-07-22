import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../../components/generic/Header";
import { User } from "firebase/auth";
import { auth } from "../..";
import { useEffect, useState } from "react";

export const AdminSection = () => {
    const user: User | null = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate("/login");
            } else {
                navigate("home");
            }
        });
    }, []);
    

    return (
        <>
            <Header user={user}></Header>
            <Outlet />
        </>
    );
}