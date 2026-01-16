import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { CHECKOUT_STRIPE, LOGIN, ROOT, WALL } from "constants/routes";
import { platform } from 'os';
import { PROGRAMS } from "constants/api";
import FlexibleModalContainer from "containers/FlexibleModalContainer";
import { redirectToRoute } from "services/LaunchServices";
import style from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import modalStyle from 'assets/style/components/Modals/Modal.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import DelayedRedirect from "./DelayedRedirect";

const popupStyle = {
    padding: '24px',
    width: '100%',
    animation: 'fadeIn 0.6s ease-out',
};

const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2a9d8f',
    marginBottom: '12px',
};

const textStyle = {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#1a1a1a',
    textAlign: 'left',
};

const strongStyle = { fontWeight: 'bold' };

const ReturnBackStripePage = () => {
    const { formatMessage } = useIntl();
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [programId, setProgramId] = useState(null);
    const [platformId, setPlatformId] = useState(null);
    const [programName, setProgramName] = useState(null);
    const [createdNewStripeUser, setCreatedNewStripeUser] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupExistedSubscription, setShowPopupExistedSubscription] = useState(false);
    const [hadExistingSubscription, setHadExistingSubscription] = useState(false);

    const redirectToStripeCheckoutRoute = (route: string) => {
        const host = window.location.hostname;
        const protocol = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : '';
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const programNameFromUrl = urlParams.get('programName');
        const platformFromUrl = urlParams.get('platformId');
        const redirectUrl = `${protocol}//${host}${port}/${route}`;
        setTimeout(() => {
            window.location.href = redirectUrl;
            // history.push(route);
            return;
        }, 2000);
    }

    const getStatus = async (sessionIdParam, action) => {
        fetch("/status-stripe-api", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ session_id: sessionIdParam || sessionId, action: action }),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log("Stripe session status:", data);
                const subscription_metadata = data.subscription_metadata;
                if (subscription_metadata && subscription_metadata.programId) {
                    setProgramId(parseInt(subscription_metadata.programId));
                }
                if (subscription_metadata && subscription_metadata.platformId) {
                    setPlatformId(parseInt(subscription_metadata.platformId));
                }
                if (subscription_metadata && subscription_metadata.programName) {
                    setProgramName(subscription_metadata.programName);
                }
                if (data.subscription_cancelled) {
                    setShowPopup(false);
                    setShowPopupExistedSubscription(false);
                    toast(`${formatMessage({ id: "modal.text.subscription.cancelled" })}`);
                    redirectToStripeCheckoutRoute(LOGIN);
                    return;
                }
                if (data.had_existing_subscription) {
                    setHadExistingSubscription(data.had_existing_subscription);
                    setShowPopupExistedSubscription(true);
                } else {
                    setShowPopupExistedSubscription(false);
                    if (data.createdNewStripeUser) {
                        setCreatedNewStripeUser(true);
                        setShowPopup(true);
                    }
                }
                setCustomerEmail(data.customer_email);
                setStatus(data.status);
            }).catch((error) => {
                toast(`${formatMessage({ id: "modal.text.pay.error.subscription" })}
                    ${formatMessage({ id: "modal.text1.pay.error.subscription" })}
                    ${formatMessage({ id: "modal.text3.pay.error.subscription" })}`
                );
                setStatus('error');
            });
    }

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionIdParam = urlParams.get('session_id');
        const action = urlParams.get('action');
        setSessionId(sessionIdParam);
        getStatus(sessionIdParam, action);
    }, []);

    // if (hadExistingSubscription) {
    //     return (
    //         <FlexibleModalContainer
    //             fullOnMobile={false}
    //             className={`${style.mediaModal} ${modalStyle.mediumModalStripe}`}
    //             closeModal={() => redirectToRoute(LOGIN)}
    //             isModalOpen={showPopupExistedSubscription}
    //         >

    //             <div className={style.modalContent}>
    //                 {/* <h4 className={style.modalTitle}>Votre Abonnement est activé</h4> */}
    //                 <div style={popupStyle}>
    //                     <div style={titleStyle}>✅ {formatMessage({ id: "modal.title.paused.subscription" })}</div>
    //                     <div style={textStyle}>
    //                         <p>{formatMessage({ id: "modal.text1.paused.subscription" })} </p>
    //                         <br />
    //                         <p>{formatMessage({ id: "modal.text2.paused.subscription" })} </p>
    //                         <br />
    //                         <p>
    //                             👉 <span style={strongStyle}>{formatMessage({ id: "modal.text3.paused.subscription" })}</span>
    //                         </p>
    //                         <br />
    //                     </div>
    //                 </div>
    //                 <button
    //                     className={coreStyle.buttonPrimary}
    //                     onClick={() => {
    //                         getStatus(sessionId, 'resume');
    //                     }}
    //                 >
    //                     {formatMessage({ id: "modal.btnOk.paused.subscription" })}
    //                 </button>
    //                 <button
    //                     className={coreStyle.buttonPrimary}
    //                     style={{ marginLeft: '20px' }}
    //                     onClick={() => {
    //                         redirectToStripeCheckoutRoute(LOGIN);
    //                     }}
    //                 >
    //                     {formatMessage({ id: "modal.btnKo.paused.subscription" })}
    //                 </button>
    //             </div>

    //         </FlexibleModalContainer>
    //     )
    // }

    if (status === 'open' || status === 'incomplete' || status === 'error') {
        const state = {
            success: false,
            userEmail: customerEmail,
            programId: programId,
            platformId: platformId,
            programName: programName
        }
        return (

            <Redirect
                to={{
                    pathname: CHECKOUT_STRIPE,
                    state: state,
                }}
            />
            // <Redirect to="/checkout-stripe" />
        )
    }

    if (status === 'complete') {
        if (createdNewStripeUser || hadExistingSubscription) {
            return (
                <>
                    <FlexibleModalContainer
                        fullOnMobile={false}
                        className={`${style.mediaModal} ${modalStyle.mediumModalStripe}`}
                        closeModal={() => redirectToRoute(ROOT + PROGRAMS)}
                        isModalOpen={showPopup}
                    >

                        <div className={style.modalContent}>
                            {/* <h4 className={style.modalTitle}>Votre Abonnement est activé</h4> */}
                            <div style={popupStyle}>
                                <div style={titleStyle}>✅ {formatMessage({ id: "modal.title.sucess.subscription" })}</div>
                                <div style={textStyle}>
                                    <p>🎉 {formatMessage({ id: "modal.text1.sucess.subscription" })} </p>
                                    <br />
                                    <p>📩 {formatMessage({ id: "modal.text2.sucess.subscription" })} </p>
                                    <ul style={{ paddingLeft: '20px', marginTop: '10px', marginBottom: '10px' }}>
                                        <li>{formatMessage({ id: "modal.text3.sucess.subscription" })} </li>
                                        <li>{formatMessage({ id: "modal.text4.sucess.subscription" })} <span style={strongStyle}>{formatMessage({ id: "modal.text5.sucess.subscription" })}</span></li>
                                    </ul>
                                    <p>
                                        👉 <span style={strongStyle}>{formatMessage({ id: "modal.text6.sucess.subscription" })}</span>{formatMessage({ id: "modal.text7.sucess.subscription" })}
                                    </p>
                                    <br />
                                    <p>🕒 {formatMessage({ id: "modal.text8.sucess.subscription" })}</p>
                                </div>
                            </div>
                            <button
                                className={coreStyle.buttonPrimary}
                                onClick={() => {
                                    redirectToStripeCheckoutRoute(LOGIN);
                                }}
                            >
                                OK
                            </button>
                        </div>

                    </FlexibleModalContainer>

                    <FlexibleModalContainer
                        fullOnMobile={false}
                        className={`${style.mediaModal} ${modalStyle.mediumModalStripe}`}
                        closeModal={() => redirectToRoute(LOGIN)}
                        isModalOpen={showPopupExistedSubscription}
                    >

                        <div className={style.modalContent}>
                            {/* <h4 className={style.modalTitle}>Votre Abonnement est activé</h4> */}
                            <div style={popupStyle}>
                                <div style={titleStyle}>✅ {formatMessage({ id: "modal.title.paused.subscription" })}</div>
                                <div style={textStyle}>
                                    <p>{formatMessage({ id: "modal.text1.paused.subscription" })} </p>
                                    <br />
                                    <p>{formatMessage({ id: "modal.text2.paused.subscription" })} </p>
                                    <br />
                                    <p>
                                        👉 <span style={strongStyle}>{formatMessage({ id: "modal.text3.paused.subscription" })}</span>
                                    </p>
                                    <br />
                                </div>
                            </div>
                            <button
                                className={coreStyle.buttonPrimary}
                                onClick={() => {
                                    getStatus(sessionId, 'resume');
                                }}
                            >
                                {formatMessage({ id: "modal.btnOk.paused.subscription" })}
                            </button>
                            <button
                                className={coreStyle.buttonSecondary}
                                style={{ marginLeft: '20px' }}
                                onClick={() => {
                                    getStatus(sessionId, 'cancel');
                                }}
                            >
                                {formatMessage({ id: "modal.btnKo.paused.subscription" })}
                            </button>
                        </div>

                    </FlexibleModalContainer>
                </>
            )
        }
        // toast(formatMessage({ id: actionSuccessMessageId }));
        // toast.success(`Ton abonnement au programme ${programName} est activé avec succès !`, {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        // });
        let url = WALL;
        let state: any = {
            success: true,
            customerEmail: customerEmail,
        }
        if (platformId && programId && programName) {
            toast(`${formatMessage({ id: "modal.text.pay.sucess.subscription" })}`);
            // url = `/wall?platformId=${platformId}&programId=${programId}&programName=${programName}`
            state = {
                success: true,
                customerEmail: customerEmail,
                programId: programId,
                platformId: platformId,
                programName: programName
            }
        } else if (createdNewStripeUser) {
            url = LOGIN;
        } else {
            url = PROGRAMS;
        }
        return (
            <Redirect
                to={{
                    pathname: url,
                    state: state
                }}
            />
        )
        // <DelayedRedirect url="/dashboard" state={{ from: "login" }} delay={3000} />

    }

    return null;
}
export default ReturnBackStripePage;