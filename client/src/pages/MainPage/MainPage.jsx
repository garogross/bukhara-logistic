import React from 'react';

import MainCardsList from "../../components/MainPage/MainCardsList/MainCardsList";

function MainPage() {

    return (
        <div className={`gradientBg`}>
            <div className={'container topDistanceBlock'}>
                <MainCardsList/>
            </div>
        </div>
    );
}

export default MainPage;