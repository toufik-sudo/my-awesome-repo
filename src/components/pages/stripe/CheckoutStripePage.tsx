import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';
import IaTextStripePage from "./IaTextStripePage";


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This test secret API key is a placeholder. Don't include personal details in requests with this key.
// To see your test secret API key embedded in code samples, sign in to your Stripe account.
// You can also find your test secret API key at https://dashboard.stripe.com/test/apikeys.
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51N4k1dL5Y2Zy7z8X9aB3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CheckoutStripePage = () => {
    //get the programId from the URL params
    const [programId, setProgramId] = useState(null);
    //get userEmeil from the URL params
    const [userEmail, setUserEmail] = useState(null);


    const fetchClientSecret = useCallback(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const programIdFromUrl = urlParams.get('programId');
        const userEmailFromUrl = urlParams.get('userEmail');
        const programNameFromUrl = urlParams.get('programName');
        const platformFromUrl = urlParams.get('platformId');
        if (userEmailFromUrl) {
            setUserEmail(userEmailFromUrl);
        } else {
            console.error("No userEmail found in the URL");
        }
        if (programIdFromUrl) {
            setProgramId(programIdFromUrl);
        } else {
            console.error("No programID found in the URL");
            setProgramId(11); // Set a default program ID or handle the error as needed            
        }
        // Create a Checkout Session
        return fetch("/checkout-stripe-api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "userEmail": userEmailFromUrl,
                "programId": programIdFromUrl,
                "programName": programNameFromUrl,
                "platformId": platformFromUrl
            })
        })
            .then((res) => res.json())
            .then((data) => data.clientSecret);
    }, [programId, userEmail]);

    const options = { fetchClientSecret };

    // console.log("Stripe options:", options);

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <div className="embedded-checkout-container" style={{ paddingTop: '3rem' }}>
                    <EmbeddedCheckout />
                    <IaTextStripePage />
                </div>
            </EmbeddedCheckoutProvider>
        </div>
    )
}

export default CheckoutStripePage;
