
export default function buildMessage(email = '') {
  return {
    subject: `Boostez la visibilité de votre centre`,
    text: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4; text-align: center;">
            <h3 style="
                font-size: 16px; 
                font-weight: 600; 
                color: black; 
                background-color:#1E2026; 
                color:white; 

                padding: 20px; 
                text-align: center; 
                ">
                CENTRES
            </h3>    

            <div style="
                max-width: 600px; 
                text-align: left; 
                margin: 0 auto; 
                background-color: white; 
                padding: 10px; 
                border-radius: 0px; 
                border: 1px solid #ccd1d1;
                ">

                <p style="
                    font-size: 15px; 
                    font-weight: 600;
                    color: #424949; 
                    padding: 20px 10px;
                    text-align: center; 
                    background: linear-gradient(90deg, #FFD700, #FFC107);
                    ">
                    🚀 Boostez la visibilité de votre centre gratuitement.
                </p>

                <p style="
                    font-size: 15px; 
                    color: black; 
                    vertical-align: middle; 
                    padding: 10px;
                    text-align: left;
                    ">
                    Vous souhaitez attirer plus de clients et faire connaître votre centre au grand public? Rejoignez dès maintenant 
                    <a href="https://www.centres.ma/" style="text-decoration: underline;">
                        centres.ma</a>, 
                    la plateforme leader pour la découverte des centres de soutiens au Maroc.
                </p>

                <p style="
                    font-size: 15px; 
                    color: black; 
                    vertical-align: middle; 
                    padding: 5px 10px;
                    text-align: left;
                    ">
                    ✅ Inscription facile et rapide
                </p>
                <p style="
                    font-size: 15px; 
                    color: black; 
                    vertical-align: middle; 
                    padding: 5px 10px;
                    text-align: left;
                    ">
                    ✅ Visibilité gratuite et ciblée
                </p>
                <p style="
                    font-size: 15px; 
                    color: black; 
                    vertical-align: middle; 
                    padding: 5px 10px;
                    text-align: left;
                    ">
                    ✅ Connectez-vous à une large audience locale
                </p>

                <p style="
                    font-size: 15px; 
                    color: black; 
                    vertical-align: middle; 
                    padding: 10px;
                    text-align: left;
                    ">
                    Ne manquez pas cette opportunité unique d'élargir votre clientèle sans frais!
                </p>

                <p style="
                    padding: 10px;
                    ">
                    <a 
                        href="https://www.centres.ma/"    
                        style="
                            text-align: center;
                            padding: 15px 20px;
                            font-size: 15px; 
                            
                            color: white; 
                            text-decoration: none;
                            background-color: #2980b9;
                            border-radius: 5px;
                        ">
                        Rejoignez-nous
                    </a>
                </p>

                <p style="
                    font-size: 15px; 
                    color: black; 
                    vertical-align: middle; 
                    padding: 10px;
                    text-align: left;
                    ">
                    À très bientôt,
                </p>

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
                        Pour ne plus recevoir cet email, 
                        <a 
                            style="text-decoration: underline;"
                            href="https://www.centres.ma/emails/${email}
                            "> 
                            unsubscribe 
                        </a>
                    </p>

                </div>
            </div>
        </div>
    `}
}



// const emails = [
//     {   
//         subject: `Boostez la visibilité de votre centre`,
//         text:`            
//             <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4; text-align: center;">
//                 <h3 style="
//                     font-size: 16px; 
//                     font-weight: 600; 
//                     color: black; 
//                     background-color:#1E2026; 
//                     color:white; 

//                     padding: 20px; 
//                     text-align: center; 
//                     ">
//                     CENTRES
//                 </h3>    

//                 <div style="
//                     max-width: 600px; 
//                     text-align: left; 
//                     margin: 0 auto; 
//                     background-color: white; 
//                     padding: 10px; 
//                     border-radius: 0px; 
//                     border: 1px solid #ccd1d1;
//                     ">

//                     <p style="
//                         font-size: 15px; 
//                         font-weight: 600;
//                         color: #424949; 
//                         padding: 20px 10px;
//                         text-align: center; 
//                         background: linear-gradient(90deg, #FFD700, #FFC107);
//                         ">
//                         🚀 Boostez la visibilité de votre centre gratuitement.
//                     </p>

//                     <p style="
//                         font-size: 15px; 
//                         color: black; 
//                         vertical-align: middle; 
//                         padding: 10px;
//                         text-align: left;
//                         ">
//                         Vous souhaitez attirer plus de clients et faire connaître votre centre au grand public? Rejoignez dès maintenant 
//                         <a href="https://www.centres.ma/" style="text-decoration: underline;">
//                             centres.ma</a>, 
//                         la plateforme leader pour la découverte des centres de soutiens au Maroc.
//                     </p>

//                     <p style="
//                         font-size: 15px; 
//                         color: black; 
//                         vertical-align: middle; 
//                         padding: 5px 10px;
//                         text-align: left;
//                         ">
//                         ✅ Inscription facile et rapide
//                     </p>
//                     <p style="
//                         font-size: 15px; 
//                         color: black; 
//                         vertical-align: middle; 
//                         padding: 5px 10px;
//                         text-align: left;
//                         ">
//                         ✅ Visibilité gratuite et ciblée
//                     </p>
//                     <p style="
//                         font-size: 15px; 
//                         color: black; 
//                         vertical-align: middle; 
//                         padding: 5px 10px;
//                         text-align: left;
//                         ">
//                         ✅ Connectez-vous à une large audience locale
//                     </p>

//                     <p style="
//                         font-size: 15px; 
//                         color: black; 
//                         vertical-align: middle; 
//                         padding: 10px;
//                         text-align: left;
//                         ">
//                         Ne manquez pas cette opportunité unique d’élargir votre clientèle sans frais!
//                     </p>

//                     <p style="
//                         padding: 10px;
//                         ">
//                         <a 
//                             href="https://www.centres.ma/"    
//                             style="
//                                 text-align: center;
//                                 padding: 15px 20px;
//                                 font-size: 15px; 
                                
//                                 color: white; 
//                                 text-decoration: none;
//                                 background-color: #2980b9;
//                                 border-radius: 5px;
//                             ">
//                             Rejoignez-nous
//                         </a>
//                     </p>

//                     <p style="
//                         font-size: 15px; 
//                         color: black; 
//                         vertical-align: middle; 
//                         padding: 10px;
//                         text-align: left;
//                         ">
//                         À très bientôt,
//                     </p>

//                     <div style="
//                         font-size: 12px; 
//                         color: black; 
//                         text-align: center;
//                         background-color: #f2f3f4;
//                         padding: 10px; 
//                         ">
                        
//                         <p style="
//                             color: #2471a3; 
//                             text-decoration: underline;
//                             ">
//                             <a href="https://www.centres.ma/"> www.centres.ma </a>
//                         </p>

//                         <p style="
//                             color:#424949;
//                             ">
//                             @2025, Tous droits reserves 
//                         </p>
                        
//                         <p style="
//                             color:#424949;
//                             ">
//                             Pour ne plus recevoir cet email, 
//                             <a 
//                                 style="text-decoration: underline;"
//                                 href="https://www.centres.ma/emails/${email}
//                                 "> 
//                                 unsubscribe 
//                             </a>
//                         </p>
    
//                     </div>
//                 </div>
//             </div>
//         `},
// ]

// export default emails;

// line-height: 40px;  /* vertically center text by matching height */
// text-align: center; /* horizontally center */