'use client'
import styles from "@/_com/dashboard/css/database.module.css";

import { useState } from "react";

import DatabaseSidebar from "./database/sidebar";
import DatabaseContent from "./database/content";

export default function DashDatabase({}) {
    
    return (
        <div className={styles.DashPage}>
            <div className={styles.DashLayout}>
                <DatabaseSidebar />
                <DatabaseContent />
            </div>

            <div className={styles.DashFooter}>
            </div>

        </div>
    )
}
