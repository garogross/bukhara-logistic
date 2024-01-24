import React from 'react';

import AdminEmployeesList from "../../../components/AdminEmployeesPage/AdminEmployeesList/AdminEmployeesList";

function AdminEmployeesPage() {
    return (
        <div className={'gradientBg'}>
            <div className={'container'}>
                <AdminEmployeesList/>
            </div>
        </div>
    )
}

export default AdminEmployeesPage;