
export function buildMessage(email = '') {
  return {
    subject: `Bienvenue sur Centres! — Touchez une audience locale`,
    text: `
        <div style="
            font-family: Arial, sans-serif; 
            color: #333; 
            padding: 20px; 
            background-color: #f4f4f4; 
            text-align: center;
            ">
            
            <div style="
                max-width: 428px;
                background-color: white;
                border: 1px solid #ccd1d1; 
                border-radius: 5px;
                overflow: hidden;
                margin: 0;
                padding: 0;
                margin: 0 auto;
                ">
                
                <div style="
                    margin: 0;
                    padding: 0;
                    text-align: center;
                    ">
                
                    <p style="
                        margin: 0;
                        padding: 0;
                        font-size: 15px; 
                        font-weight: 600;
                        color: white; 
                        padding: 20px 10px;
                        text-align: center; 
                        text-decoration: none;
                        background: linear-gradient(135deg, #1b4f72, #2471a3, #4a89c7);
                        ">
                        CENTRES
                    </p>
                </div>

                <div style="
                    text-align: center;
                    background-color: white;
                    text-align: left;
                    font-size: 14px; 
                    color: black; 
                    ">
                    
                    <p style="
                        padding: 10px;
                        ">
                        Bonjour!
                    </p>
                    
                    <p style="
                        padding: 10px;
                        ">
                        🚀 Boostez la visibilité de votre centre gratuitement.
                    </p>

                    <p style="
                        padding: 10px;
                        ">
                        Vous souhaitez attirer plus de clients et faire connaître votre centre au grand public? Rejoignez dès maintenant
                        <a href="https://www.centres.ma/home" 
                            style="text-decoration: underline; color: #2471a3; font-weight: 600;">
                            centres.ma</a>, 
                        la plateforme leader pour la découverte des centres de soutiens au Maroc.
                    </p>
                    
                    <p style="
                        padding: 5px 10px;
                        ">
                        ✅ Inscription facile et rapide
                    </p>
                    <p style="
                        padding: 5px 10px;
                        ">
                        ✅ Visibilité gratuite et ciblée
                    </p>
                    <p style="
                        padding: 5px 10px;
                        ">
                        ✅ Touchez une audience locale
                    </p>

                    <p style="
                        padding: 10px;
                        ">
                        Ne manquez pas cette opportunité unique d'élargir votre clientèle sans frais!
                    </p>

                    <p style="
                        padding: 10px;
                        ">
                        <a 
                            href="https://www.centres.ma/home"    
                            style="
                                width: 100%
                                text-decoration: none;
                                color: #2471a3; 
                            ">
                            https://www.centres.ma/home
                        </a>
                    </p>

                    <p style="
                        padding: 10px;
                        ">
                        À très bientôt,
                    </p>
                    
                    <p style="
                        padding: 10px;
                        ">
                        L'équipe Centres
                    </p>

                </div>

                <div style="
                    font-size: 12px; 
                    color: black; 
                    text-align: center;
                    background-color: #f2f3f4;
                    padding: 10px; 
                    ">
                    
                    <p style="
                        color: #2471a3; 
                        text-decoration: underline;
                        ">
                        <a href="https://www.centres.ma/"> www.centres.ma </a>
                    </p>

                    <p style="
                        color:#424949;
                        ">
                        @2025, Tous droits reserves 
                    </p>

                    <p style="
                        color:#424949;
                        ">
                        <a 
                            style="text-decoration: underline;"
                            href="https://www.centres.ma/home/${email}
                            "> 
                            Je ne souhaite plus recevoir cet e-mail
                        </a>
                    </p>

                </div>
            </div>
        </div>
    `}
}

export function signupMessage(token = '') {
  return {
    subject: `Bienvenue sur Centres! — Commencez en quelques minutes`,
    text: `
        <div style="
            font-family: Arial, sans-serif; 
            color: #333; 
            padding: 20px; 
            background-color: #f4f4f4; 
            text-align: center;
            ">
            
            <div style="
                background-color: white;
                border: 1px solid #ccd1d1; 
                border-radius: 5px;
                overflow: hidden;
                margin: 0;
                padding: 0;
                margin: 0 auto;
                ">
                
                <div style="
                    margin: 0;
                    padding: 0;
                    text-align: center;
                    ">
                
                    <p style="
                        margin: 0;
                        padding: 0;
                        font-size: 15px; 
                        font-weight: 600;
                        color: white; 
                        padding: 20px 10px;
                        text-align: center; 
                        text-decoration: none;
                        background: linear-gradient(135deg, #1b4f72, #2471a3, #4a89c7);
                        ">
                        CENTRES
                    </p>
                </div>

                <div style="
                    text-align: center;
                    background-color: white;
                    text-align: left;
                    font-size: 14px; 
                    color: black; 
                    ">
                    
                    <p style="
                        padding: 10px;
                        ">
                        Bonjour!
                    </p>
                    
                    <p style="
                        padding: 10px;
                        ">
                        Merci de vous être inscrit sur Centres.
                    </p>
                    
                    <p style="
                        padding: 10px;
                        ">
                        Cliquez sur le lien ci-dessous pour activer votre compte.
                    </p>

                    <p style="
                        padding: 10px;
                        text-decoration: none; 
                        ">
                        <a 
                            href="https://www.centres.ma/auth/signup/${token}"    
                            style="
                                width: 100%
                                text-decoration: none; 
                            ">
                            https://www.centres.ma/auth/signup/${token}
                        </a>
                    </p>

                    <p style="
                        padding: 10px;
                        ">
                        Si vous n'avez pas demandé cette activation, veuillez ignorer cet e-mail.
                    </p>

                    <p style="
                        padding: 10px;
                        ">
                        L’équipe Centres
                    </p>

                </div>

                <div style="
                    font-size: 12px; 
                    color: black; 
                    text-align: center;
                    background-color: #f2f3f4;
                    padding: 10px; 
                    ">
                    
                    <p style="
                        color: #2471a3; 
                        text-decoration: underline;
                        ">
                        <a href="https://www.centres.ma/"> www.centres.ma </a>
                    </p>

                    <p style="
                        color:#424949;
                        ">
                        @2025, Tous droits reserves 
                    </p>
                    

                </div>
            </div>
        </div>
    `}
}

export function resetMessage(token = '') {
  return {
    subject: `Réinitialisation de votre mot de passe — Centres`,
    text: `
        <div style="
            font-family: Arial, sans-serif; 
            color: #333; 
            padding: 20px; 
            background-color: #f4f4f4; 
            text-align: center;
            ">
            
            <div style="
                background-color: white;
                border: 1px solid #ccd1d1; 
                border-radius: 5px;
                overflow: hidden;
                margin: 0;
                padding: 0;
                margin: 0 auto;
                ">
                
                <div style="
                    margin: 0;
                    padding: 0;
                    text-align: center;
                    ">
                
                    <p style="
                        margin: 0;
                        padding: 0;
                        font-size: 15px; 
                        font-weight: 600;
                        color: white; 
                        padding: 20px 10px;
                        text-align: center; 
                        text-decoration: none;
                        background: linear-gradient(135deg, #1b4f72, #2471a3, #4a89c7);
                        ">
                        CENTRES
                    </p>
                </div>

                <div style="
                    text-align: center;
                    background-color: white;
                    text-align: left;
                    font-size: 14px; 
                    color: black; 
                    ">
                    
                    <p style="
                        padding: 10px;
                        ">
                        Bonjour!
                    </p>
                    
                    <p style="
                        padding: 10px;
                        ">
                        Vous avez demandé à réinitialiser votre mot de passe sur Centres.
                    </p>
                    
                    <p style="
                        padding: 10px;
                        ">
                        Cliquez sur le lien ci-dessous pour changer votre mot de passe.
                    </p>

                    <p style="
                        padding: 10px;
                        text-decoration: none; 
                        ">
                        <a 
                            href="https://www.centres.ma/auth/reset/${token}"    
                            style="
                                width: 100%
                                text-decoration: none; 
                            ">
                            https://www.centres.ma/auth/reset/${token}
                        </a>
                    </p>

                    <p style="
                        padding: 10px;
                        ">
                        Si vous n'avez pas demandé cette activation, veuillez ignorer cet e-mail.
                    </p>

                    <p style="
                        padding: 10px;
                        ">
                        L’équipe Centres
                    </p>

                </div>

                <div style="
                    font-size: 12px; 
                    color: black; 
                    text-align: center;
                    background-color: #f2f3f4;
                    padding: 10px; 
                    ">
                    
                    <p style="
                        color: #2471a3; 
                        text-decoration: underline;
                        ">
                        <a href="https://www.centres.ma/"> www.centres.ma </a>
                    </p>

                    <p style="
                        color:#424949;
                        ">
                        @2025, Tous droits reserves 
                    </p>
                    

                </div>
            </div>
        </div>
    `}
}

