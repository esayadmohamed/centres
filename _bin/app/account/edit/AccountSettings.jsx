"use client";

import { useState } from "react";
import AccountEdit from "./AccountEdit";

export default function AccountSettings() {
    const [activeItem, setActiveItem] = useState(null);

    return (
        <>
            <AccountEdit 
                title="Nom" 
                description="John Doe"
                activeItem={activeItem} 
                setActiveItem={setActiveItem} 
            />
            <AccountEdit 
                title="Adresse e-mail" 
                description="john@example.com"
                activeItem={activeItem} 
                setActiveItem={setActiveItem} 
            />
            <AccountEdit 
                title="Numéro de téléphone" 
                description="0612345678"
                activeItem={activeItem} 
                setActiveItem={setActiveItem} 
            />
            <AccountEdit 
                title="Mot de passe" 
                description="********"
                activeItem={activeItem} 
                setActiveItem={setActiveItem} 
            />
        </>
    );
}
