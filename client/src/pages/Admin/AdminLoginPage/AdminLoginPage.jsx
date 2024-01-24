import React from 'react';

import AuthBlock from "../../../components/global/AuthBlock/AuthBlock";

function AdminLoginPage() {


    return (
        <AuthBlock
            isAdmin={true}
        />
    );
}

export default AdminLoginPage;