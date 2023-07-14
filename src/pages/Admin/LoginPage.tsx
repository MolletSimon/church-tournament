import React, { useRef, useState } from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "../../components/generic/Button";

const LoginPage = () => {
	const password = useRef<HTMLInputElement>(null);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (password.current && password.current.value === "motdepassetournoi") {
			localStorage.setItem("connected", "true");
			navigate("/admin")
		} else {
			setError("Mot de passe incorrect");
		}
	};

	return (
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<div className="w-full max-w-md">
				<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
					<h1 className="text-2xl font-bold mb-6 text-center">Connectez-vous</h1>

					{error && <p className="text-red-500 mb-4">{error}</p>}

					<div className="mb-4">
						<label className="block text-gray-700 font-bold mb-2" htmlFor="password" id="password">
							Mot de passe
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
							id="password"
							name="password"
							type="password"
							ref={password}
							placeholder="********"
						/>
					</div>

					<div className="flex items-center justify-between">
						<Button color="primary" type="submit">Se connecter</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;