import React from 'react';

import PaymentList from "../../components/global/PaymentList/PaymentList";


function PaymentsPage() {
    return (
        <div className={'gradientBg'}>
            <div className={'container'}>
                <PaymentList/>
            </div>
        </div>
    );
}

export default PaymentsPage;