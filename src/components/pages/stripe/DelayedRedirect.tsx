import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

function DelayedRedirect({ url, state, delay = 2000 }) { // délai en ms
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShouldRedirect(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    if (shouldRedirect) {
        return (
            <Redirect
                to={{
                    pathname: url,
                    state: state
                }}
            />
        );
    }

    return <p>Redirection dans {delay / 1000} secondes...</p>;
}

export default DelayedRedirect;
