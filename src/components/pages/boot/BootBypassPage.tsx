
import React, { useState, useEffect } from 'react';
import { setGoogleAnalytics } from 'services/IaServices';

const BootBypassPage = ()=>{
    useEffect(()=>{
        setGoogleAnalytics({});
    })
    return (
        <>
        Hello
        </>
    );
}
export default BootBypassPage;