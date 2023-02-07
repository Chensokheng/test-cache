import React from "react";
import Link from "next/link";

export default function Home({ data }) {
	return (
		<div>
			<Link href={"/about"}>Home</Link>
			<pre>{JSON.stringify(data)}</pre>
		</div>
	);
}

export async function getServerSideProps({ req, res }) {
	res.setHeader(
		"Cache-Control",
		"public, s-maxage=30, stale-while-revalidate=59"
	);

	const data = await fetch(
		"https://official-joke-api.appspot.com/random_joke"
	)
		.then((response) => response.json())
		.then((json) => json);
	return {
		props: { data }, // will be passed to the page component as props
	};
}

function sleep(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
