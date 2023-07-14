import React from "react";

export function Header() {
	return (
		<div className="flex gap-6 justify-between m-12">
			<div className="flex items-center">
				<img
					src="/images/logo.png"
					className="rounded-full bg-primary p-4"
					alt="logo"
					width={120} />
				<h1 className="uppercase text-6xl ml-8 tracking-widest font-bold text-primary font-lexend">
					Pied ballon
				</h1>
			</div>
			<div className="flex items-center gap-4 rounded-full border-2 px-8 border-primary">
				<span className="bg-primary rounded-full p-4 text-white text-lg font-bold">
					SM
				</span>
				<p className="italic text-lg">Simon M.</p>
			</div>
		</div>
	);
}
