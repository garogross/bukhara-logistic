import React from 'react';
import styles from "./YearsListWrapper.module.scss";
import YearsList from "./YearsList/YearsList";

function YearsListWrapper({children,onChange,loading}) {
    return (
        <div className={styles['yearsListWrapper']}>
            {children}
            <YearsList onChange={onChange} loading={loading}/>
        </div>
    );
}

export default YearsListWrapper;