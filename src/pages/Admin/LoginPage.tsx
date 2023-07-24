import React, { useRef, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { Button } from "../../components/generic/Button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../..";
import Loader from "../../components/generic/Loader";
import { Header } from "../../components/generic/Header";

const LoginPage = () => {
	const password = useRef<HTMLInputElement>(null);
	const email = useRef<HTMLInputElement>(null);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const [authChecked, setAuthChecked] = useState(false);


	// check when auth status changes
	auth.onAuthStateChanged((user) => {
		if (user) navigate("/admin/home");
		setAuthChecked(true);
	})

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (password.current && password.current.value === "beta") {
			localStorage.setItem("connected", "true");
			navigate("/admin")
		} else {
			setError("Mot de passe incorrect");
		}
	};

	const handleLoginWithGoogle = () => {
		// login with google with firebase auth
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider).then(() => {
		}).catch((error) => {
			console.log(error);
		});
	};

	return (
		<>
		<Header user={null}/>
		<div className="flex justify-center items-center mt-6">
			{authChecked ? <div className="w-full max-w-4xl">
				<form data-aos="flip-up" className="bg-white shadow-md rounded-xl px-36 py-12 mb-4" onSubmit={handleSubmit}>
					<h1 className="text-3xl font-bold mb-6 text-center text-primary">Connectez-vous</h1>

					{error && <p className="text-red-500 mb-4">{error}</p>}

					<div className="mb-6">
						<label className="block text-gray-700 font-bold mb-2" htmlFor="password" id="password">
							Adresse email
						</label>
						<input
							className="placeholder:italic appearance-none border rounded-xl w-full py-3 px-4 text-primary transition-all duration-300 leading-tight focus:outline-none focus:shadow-outline focus:scale-110"
							id="email"
							name="email"
							type="email"
							ref={email}
							placeholder="Votre adresse mail ici"
						/>
					</div>

					<div className="mb-6">
						<label className="block text-gray-700 font-bold mb-2" htmlFor="password" id="password">
							Mot de passe
						</label>
						<input
							className=" appearance-none border rounded-xl w-full py-3 px-4 text-primary leading-tight transition-all duration-300 focus:outline-none focus:shadow-outline focus:scale-110"
							id="password"
							name="password"
							type="password"
							ref={password}
							placeholder="********"
						/>
					</div>

					<div className="flex flex-col items-center justify-center gap-3">
						<Button 
							color="primary" 
							type="submit" 
							additionalClass="w-full">Se connecter</Button>
						<Button 
							color="white" 
							text="black" 
							type="button" 
							action={handleLoginWithGoogle}
							additionalClass="border-2 w-full flex items-center justify-center gap-4">
							<img src="images/google.png" alt="google" width={18} />
							<span>Se connecter avec Google</span>
						</Button>
						<Link to={'/signup'}>
							<p className="text-primary underline hover:scale-105 transition-all">S'inscrire</p>
						</Link>
					</div>
				</form>
			</div> : <Loader/>}
			
		</div>
		</>
	);
};

export default LoginPage;