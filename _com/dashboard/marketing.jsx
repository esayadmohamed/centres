'use client'
import styles from "@/_com/dashboard/css/marketing.module.css";

import { useState } from "react";

import MarketingSidebar from "./marketing/sidebar";
import MarketingContent from "./marketing/content";

export default function DashMarketing({centersList, citiesList}) {
    
    const [centers, setCenters] = useState(centersList || []);
    const [center, setCenter] = useState(null);

    return (
        <div className={styles.DashPage}>
            <div className={styles.DashLayout}>
                <MarketingSidebar citiesList={citiesList} centersList={centersList} centers={centers} setCenters={setCenters} setCenter={setCenter}/>
                <MarketingContent center={center} setCenter={setCenter} setCenters={setCenters}/>
            </div>

            <div className={styles.DashFooter}>
            </div>

        </div>
    )
}
