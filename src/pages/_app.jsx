import React, { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";

export default function MyApp({ Component, pageProps }) {
	useEffect(() => {
		Router.events.on("routeChangeStart", NProgress.start);
		Router.events.on("routeChangeComplete", NProgress.done);
		Router.events.on("routeChangeError", NProgress.done);
		return () => {
			Router.events.off("routeChangeStart", NProgress.start);
			Router.events.off("routeChangeComplete", NProgress.done);
			Router.events.off("routeChangeError", NProgress.done);
		};
	}, []);
	return <Component {...pageProps} />;
}
