import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { HEIGHT } from 'constants/wall/posts';
const iaStyle = {
    container: {
        display: 'block',
        fontFamily: 'Arial, sans-serif',
        color: '#1a1a1a',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        lineHeight: 1.6,
        fontSize: '16px',
        maxWidth: '600px',
        margin: '0 auto',
        // position: 'absolute',
        top: '29.5rem',
        marginTop: '1rem'
    },
    title: {
        fontSize: '20px',
        color: '#e63946',
        fontWeight: 'bold',
        paddingBottom: '0.6rem',
    },
    subtitle: {
        fontWeight: 'bold',
    },
    subtitleTrial: {
        fontWeight: 'bold',
        paddingTop: '1rem',
        fontSize: 'large',
        paddingBottom: '1rem',
    },
    sectionTitle: {
        color: '#457b9d',
        fontWeight: 'bold',
    },
    button: {
        display: 'inline-block',
        backgroundColor: '#1d3557',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '16px',
    }
};

const getLeftValue = (width) => {
    if (width <= 1500) {
        return '0rem';
    } else if (width >= 1501 && width <= 1700) {
        return '16rem';
    } else if (width >= 1701 && width <= 1850) {
        return '26rem';
    } else if (width >= 1851 && width < 2000) {
        return '35rem';
    } else if (width >= 2100 && width < 2200) {
        return '46rem';
    } else if (width >= 2200 && width < 2300) {
        return '49rem';
    } else if (width >= 2300 && width < 2500) {
        return '59rem';
    } else {
        return '67rem';
    }
};

const IaTextStripePage = () => {
    const getPositionValue = (width) => {
        // You can implement similar logic for width if needed
        if (width <= 1024) {
            // setTop('0rem');
            return 'static';
        }
        return 'absolute'; // Placeholder
    };

    const { formatMessage } = useIntl();
    const [left, setLeft] = useState(getLeftValue(window.innerWidth));
    const [position, setPosition] = useState(getPositionValue(window.innerWidth));

    useEffect(() => {
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerWidth]);

    const handleResize = () => {
        setLeft(getLeftValue(window.innerWidth));
        setPosition(getPositionValue(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);

    return (
        <span style={{ ...iaStyle.container, left: left, position: position }}>
            <div style={iaStyle.title}>{formatMessage({ id: "modal.title.subscription" })}</div>
            <div style={iaStyle.subtitle}>
                {formatMessage({ id: "modal.text.subscription" })}
            </div>
            <div style={iaStyle.subtitleTrial}>
                {formatMessage({ id: "modal.trial.subscription" })}
            </div>
            {/* <br /> */}
            {formatMessage({ id: "modal.text1.subscription" })}
            <br />
            {formatMessage({ id: "modal.text2.subscription" })} <strong>{formatMessage({ id: "modal.text3.subscription" })}</strong> {formatMessage({ id: "modal.text4.subscription" })} <strong>{formatMessage({ id: "modal.text5.subscription" })}</strong>.
            <br /><br />
            ✅ <strong>{formatMessage({ id: "modal.text6.subscription" })}</strong><br />
            🎯 {formatMessage({ id: "modal.text7.subscription" })} <br />
            📞 {formatMessage({ id: "modal.text8.subscription" })}<br />
            🔥 {formatMessage({ id: "modal.text9.subscription" })}
            <br /><br />
            <div style={iaStyle.sectionTitle}>💼 {formatMessage({ id: "modal.text10.subscription" })}</div>
            <br />
            {formatMessage({ id: "modal.text11.subscription" })} – <strong>{formatMessage({ id: "modal.text12.subscription" })}</strong> {formatMessage({ id: "modal.text13.subscription" })}<br />
            {formatMessage({ id: "modal.text14.subscription" })} <strong>{formatMessage({ id: "modal.text15.subscription" })}</strong> {formatMessage({ id: "modal.text16.subscription" })} <strong>{formatMessage({ id: "modal.text17.subscription" })}</strong>.
            <br />
            {/* <a href="#paiement" style={iaStyle.button}>👉 Je débloque l’IA et je passe au niveau supérieur</a> */}
        </span>
    );
}

export default IaTextStripePage;
