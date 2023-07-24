import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../..";
import { Button } from "../../components/generic/Button";
import { Header } from "../../components/generic/Header";
import { FormInput } from "../../components/generic/FormInput";

export const SignUpPage = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState({
        email: "",
        confirmPassword: "",
        password: ""
    });
    const navigate = useNavigate();
    const checkIfError = error.confirmPassword !== "" || error.email !== "" || error.password !== "";
    const checkIfNull = emailRef.current?.value === "" || passwordRef.current?.value === "" || confirmPasswordRef.current?.value === "";

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (passwordRef.current && confirmPasswordRef.current && emailRef.current) {
            if (!checkIfError) {
                createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
                    .then((userCredential) => {
                        // update displayname of user
                        if (nameRef.current) {
                            updateProfile(userCredential.user, {
                                displayName: nameRef.current.value
                            }).then(() => {
                                // navigate to home
                                navigate("/admin/home");
                            }).catch((error) => {
                                console.error(error.message);
                                navigate("/admin/home");
                            });
                        } else {
                            navigate("/admin/home");
                        } 
                    })
                    .catch((error) => {
                        setError(error.message);
                    });
            } else {
                setError({...error, confirmPassword: "Les mots de passe ne correspondent pas"});
            }
        } else {
            setError({...error, email: "Veuillez entrer une adresse email", password: "Veuillez entrer un mot de passe"});
        }
    };

    const checkEmail = () => {
        const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRef.current) {
            if (emailRef.current.value === "") {
                setError({...error, email:"Veuillez entrer une adresse email"});
            } else {
                // check with regex if email is valid
                if (!String(emailRef.current.value).toLowerCase().match(mailRegex)) {
                    setError({...error, email:"Veuillez entrer une adresse email valide"});
                } else {
                    setError({...error, email:""});
                }
            }
        }
    };

    const checkPassword = () => {
        // check if password is strong enough
        if (passwordRef.current) {
            if (passwordRef.current.value === "") {
                setError({...error, password:"Veuillez entrer un mot de passe"});
            } else {
                if (passwordRef.current.value.length < 8) {
                    setError({...error, password:"Le mot de passe doit contenir au moins 8 caractères"});
                } else {
                    setError({...error, password:""});
                }
            }
        }
    };

    const checkConfirmPassword = () => {
        if (confirmPasswordRef.current) {
            if (confirmPasswordRef.current.value === "") {
                setError({...error, confirmPassword:"Veuillez confirmer votre mot de passe"});
            } else {
                if (confirmPasswordRef.current.value !== passwordRef.current?.value) {
                    setError({...error, confirmPassword:"Les mots de passe ne correspondent pas"});
                } else {
                    setError({...error, confirmPassword:""});
                }
            }
        }
    };

    
    return (
        <div>
            <Header user={null}></Header>
            <h1 className="text-3xl text-center mx-auto w-full m-10 text-primary font-bold font-lexend">Par ici l'inscription !</h1>
            <form onSubmit={handleSubmit} 
                className="flex flex-col mb-4 shadow-md border-[1px] border-opacity-25 border-primary rounded-xl mx-auto w-2/3 my-auto px-6 pt-12 pb-6 justify-center items-center gap-8">
                <FormInput label="Nom" id="name" placeholder="Votre nom, prénom, pseudo... comme vous voulez en fait !" innerRef={nameRef} type="text"></FormInput>
                <FormInput onBlur={checkEmail} label="Adresse email" error={error.email} id="email" placeholder="Votre adresse ici..." innerRef={emailRef} type="email"></FormInput>
                <FormInput onBlur={checkPassword} error={error.password} label="Mot de passe" id="password" placeholder="Entrez un mot de passe" innerRef={passwordRef} type="password"></FormInput>
                <FormInput onBlur={checkConfirmPassword} error={error.confirmPassword} label="Confirmez votre mot de passe" placeholder="Confirmez votre mot de passe" id="confirmPassword" innerRef={confirmPasswordRef} type="password"></FormInput>
                <Button disabled={checkIfError || checkIfNull} color="primary" type="submit">S'inscrire</Button>
            </form>
        </div>
    )
}