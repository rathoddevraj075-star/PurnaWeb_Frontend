import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    // useLayoutEffect runs synchronously before browser paint
    useLayoutEffect(() => {
        // Reset scroll on both window and document element
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0; // For Safari
    }, [pathname]);

    return null;
}
