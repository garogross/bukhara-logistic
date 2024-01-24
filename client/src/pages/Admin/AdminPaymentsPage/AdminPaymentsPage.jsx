import React from 'react';

import PaymentList from "../../../components/global/PaymentList/PaymentList";

function AdminPaymentsPage() {
    return (
        <div className={'gradientBg'}>
            <div className={'container'}>
                <PaymentList isAdmin={true}/>
            </div>
        </div>
    );
}

export default AdminPaymentsPage;