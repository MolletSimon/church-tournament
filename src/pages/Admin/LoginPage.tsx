import React, { useState } from "react";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (password === "motdepassetournoi") {
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
						<label className="block text-gray-700 font-bold mb-2" htmlFor="password">
							Mot de passe
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="password"
							name="password"
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="********"
						/>
					</div>

					<div className="flex items-center justify-between">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="submit"
						>
							Se connecter
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;