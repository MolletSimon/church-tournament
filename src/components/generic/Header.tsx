import { User, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { auth } from "../..";

export function Header({user}: {user: User | null}) {
	return (
		<>
			<div className="flex gap-6 justify-between m-12">
			<div className="custom-shape-divider-top-1690067049">
				<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
				</svg>
			</div>
				<Link to="/admin">
				<div className="flex items-center cursor-pointer mt-10">
					<img
						src="/images/logo.png"
						className="rounded-full bg-primary p-4"
						alt="logo"
						width={120} />
					<h1 className="uppercase text-6xl ml-8 tracking-widest font-bold text-primary font-lexend">
						Pied ballon
						<span className="text-lg items-center italic"> - beta</span>
					</h1>
				</div>
				</Link>
				{user && 
					<div className="flex items-center gap-4 rounded-full border-2 px-8 border-primary">
						{user.photoURL ? <img src={user.photoURL!} alt="user" width={60} className="rounded-full" /> : 
						<span className="bg-primary rounded-full p-4 text-white text-lg font-bold">
							SM
						</span>}
					
						<p className="italic text-xl font-bold text-primary">{user.displayName}</p>
						<Button color="white" action={() => {signOut(auth)}}>
							<img src="/images/logout.png" alt="logout" width={25} className="mr-2" />
						</Button>
					</div>
				}
				
			</div>
			<p className="italic mx-4">Ce produit est encore en cours de développement et vous avez accès à une version anticipée. Si un bug parvenait lors de votre parcours, n'hésitez pas à en informer 
			<a href="mailto:simonmollet.developpement@gmail.com" className="underline text-primary"> Simon Mollet Développement</a></p>
		</>
	);
}
