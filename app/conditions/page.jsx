import styles from "./style.module.css";
import Link from "next/link";

import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";

import Icon from "@/_lib/utils/Icon";

export default async function Listings() {

    // const listings = await userListings(); 

    return (
        <main className="content">
            <Header />
                <div className={styles.ConditionsContent}>
                    <div className={styles.ConditionsBanner}>
                        <h2>Conditions d'utilisation</h2>  
                        <ul className={styles.AuthRoot}>
                            <Link href={'/'}> <li>Acueil</li> </Link>
                            <li>/</li>
                            <li>Conditions</li>
                        </ul>
                    </div>
                    <div className={styles.Conditions}>
                        <p>Les présentes conditions s’appliquent à l’utilisation du site centres.ma, une plateforme dédiée à la recherche, la publication et l’évaluation de centres de soutien scolaire et linguistique. Elles peuvent être modifiées à tout moment, en fonction des évolutions techniques, juridiques ou fonctionnelles du site. En accédant à centres.ma, vous acceptez de consulter régulièrement ces conditions et de vous conformer à toute modification ou mise à jour. Si vous êtes en désaccord avec tout ou partie de ces conditions, vous ne devez pas utiliser le site ni ses services. Dernière mise à jour : 7 mai 2025.</p>
                        
                        <section>
                            <h3>1- Licences</h3>
                            <p>Le site centres.ma contient des textes, images, données, avis et autres contenus qui sont la propriété exclusive de la plateforme ou de ses utilisateurs. Sous réserve du respect des présentes conditions, vous êtes autorisé à consulter et publier des annonces relatives à des centres de soutien scolaire ou linguistique.</p>
                            <p>Toute reproduction, distribution, modification, ou diffusion de tout ou partie du contenu du site, sur un autre site web, serveur ou support, est strictement interdite sans autorisation écrite préalable. Vous n’êtes pas autorisé à modifier, créer des œuvres dérivées à partir des contenus présents sur le site, ni à supprimer ou altérer les mentions de droits d’auteur ou toute autre information juridique y figurant.</p>
                            <p>En publiant du contenu sur centres.ma (annonce, image, description, avis, etc.), vous accordez à centres.ma une licence mondiale, non exclusive, gratuite et irrévocable, lui permettant de reproduire, modifier, publier, traduire, distribuer, afficher et utiliser ce contenu dans le cadre de l'exploitation, la promotion ou la maintenance de la plateforme.</p>
                            <p>centres.ma n'est pas responsable des contenus, services ou déclarations figurant dans les annonces publiées par les utilisateurs. Nous ne pouvons garantir l’exactitude, la véracité ou la légalité des informations publiées par les membres. Il est possible que certains contenus soient inappropriés ou offensants ; vous reconnaissez utiliser le site à vos propres risques.</p>
                            <p>Chaque utilisateur est seul responsable du contenu qu’il publie sur le site et s’engage à respecter les lois et règlements en vigueur au Maroc. Vous vous engagez à ne publier que des informations dont vous détenez les droits nécessaires.</p>
                            <p>Enfin, centres.ma se réserve le droit d’utiliser certaines informations relatives à ses membres dans le cadre de campagnes marketing internes, conformément à notre politique de confidentialité.</p>
                        </section>

                        <section>
                            <h3>2. La communauté centres.ma</h3>
                            <p>centres.ma est une plateforme gratuite destinée aux particuliers et professionnels de l’éducation qui souhaitent faire connaître ou découvrir des centres de soutien scolaire et linguistique à travers le Maroc. Elle s’adresse aux parents, élèves, étudiants, enseignants, et responsables de centres de formation à la recherche de cours dans différentes matières ou langues.</p>
                            <p>Les membres de la communauté peuvent :</p>
                            <ul>
                                <li>• Créer un compte personnel ou professionnel;</li>
                                <li>• Publier des annonces pour présenter un centre de soutien ou une offre de formation;</li>
                                <li>• Rechercher des centres selon la ville, les matières, ou les langues proposées;</li>
                                <li>• Lire et partager des avis sur les centres pour aider les autres à faire des choix éclairés.</li>
                            </ul>
                            <p>Notre mission est de faciliter la mise en relation entre les apprenants et les structures d’accompagnement éducatif, en promouvant la transparence, la qualité et la fiabilité des informations partagées.</p>
                        </section>

                        <section>
                            <h3>3- Règles de fonctionnement</h3>
                            <p>Afin d’assurer une expérience claire, fiable et respectueuse pour l’ensemble des utilisateurs de centres.ma, certaines règles générales de fonctionnement sont mises en place.</p>
                            <p>Ces règles peuvent concerner, sans s’y limiter :</p>
                            <ul>
                                <li>• La durée de publication des annonces de centres;</li>
                                <li>• La taille des descriptions, images et autres contenus soumis;</li>
                                <li>• La modération des avis et commentaires publiés par les utilisateurs;</li>
                                <li>• La fréquence de modification des annonces pour garantir leur authenticité.</li>
                            </ul>
                            <p>Il est de votre responsabilité de conserver une copie de toute information que vous publiez sur le site. centres.ma ne pourra être tenu responsable de la suppression ou de la perte éventuelle de contenu, qu’elle soit volontaire (modération, expiration) ou involontaire (erreur technique).</p>
                            <p>Si vous pensez qu’une règle nuit à la qualité ou à l’objectif de la plateforme, nous vous encourageons à nous contacter afin de proposer des améliorations. Notre volonté est de construire une communauté utile, transparente et bienveillante autour de l’éducation.</p>
                        </section>

                        <section>
                            <h3>3.1- Liens externes</h3>
                            <p>Les contenus publiés sur centres.ma (annonces, avis, descriptions, etc.) peuvent contenir des liens vers des sites tiers ou des ressources externes. Ces liens sont placés sous la seule responsabilité des utilisateurs.</p>
                            <p>centres.ma n'exerce aucun contrôle sur ces sites ou contenus externes, ne les cautionne pas et ne garantit ni leur fiabilité, ni leur légalité, ni leur qualité. Par conséquent, la plateforme ne pourra en aucun cas être tenue responsable de tout dommage ou perte liés à l'accès ou à l'utilisation de ces liens.</p>
                            <p>Il est recommandé aux utilisateurs de faire preuve de prudence et de consulter les mentions légales et politiques de confidentialité des sites externes avant de les utiliser.</p>
                        </section>

                        <section>
                            <h3>3.2- Interdiction du spam</h3>
                            <p>centres.ma interdit strictement toute forme de communication non sollicitée, notamment le spam, les messages publicitaires abusifs, les chaînes de courriels, ou les contenus promotionnels déguisés.</p>
                            <p>Les utilisateurs ne doivent en aucun cas utiliser la plateforme pour envoyer des messages à caractère commercial à d’autres membres sans leur consentement explicite. Cette règle s’applique aussi bien aux sections de contact des annonces qu’aux avis ou autres espaces de contribution.</p>
                            <p>Si vous recevez des messages non sollicités en lien avec votre activité sur centres.ma, nous vous encourageons à nous en informer immédiatement. Nous nous réservons le droit de suspendre ou supprimer le compte de tout utilisateur contrevenant à cette règle.</p>
                        </section>

                        <section>
                            <h3>3.3- Contenu retiré du site</h3>
                            <p>centres.ma se réserve le droit, mais n’a pas l’obligation, de refuser, déplacer ou retirer tout contenu (annonce, avis, commentaire, etc.) qui ne respecte pas les objectifs et l’esprit de notre communauté éducative. Cela inclut, sans s’y limiter, les annonces trompeuses, abusives, ou inappropriées.</p>
                            <p>Nous pouvons également suspendre ou supprimer votre compte si nous estimons que vos actions perturbent l’expérience des autres utilisateurs ou si elles exposent centres.ma à un risque juridique ou à une responsabilité envers un tiers.</p>
                            <p>centres.ma se réserve le droit de supprimer, sans préavis et sans compensation, toute annonce ou avis qui ne respecte pas les règles de diffusion de la plateforme ou qui porte atteinte aux droits d’un tiers, qu’il s’agisse de droits d’auteur, de marques déposées, ou de tout autre droit protégé par la législation en vigueur.</p>
                        </section>

                        <section>
                            <h3>3.4- Accès réservé aux utilisateurs de 16 ans ou plus</h3>
                            <p>L'accès à centres.ma est réservé aux personnes âgées de 16 ans ou plus. En utilisant ce site, vous certifiez avoir 16 ans ou plus au moment de votre inscription ou de votre utilisation des services proposés.</p>
                            <p>Les parents ou tuteurs légaux doivent s'assurer que leurs enfants n'accèdent pas à ce site sans leur permission, étant donné que le contenu peut inclure des informations ou des services qui ne sont pas adaptés à un jeune public.</p>
                        </section>

                        <section>
                            <h3>3.5- Annonces multiples</h3>
                            <p>Il est interdit de publier plusieurs annonces identiques ou substantiellement similaires sur centres.ma. Chaque centre doit être présenté dans une seule annonce par utilisateur, afin d’éviter la duplication du contenu et de garantir une navigation claire et efficace pour les autres membres de la communauté.</p>
                            <p>Si vous souhaitez apporter des modifications à une annonce existante (par exemple, mettre à jour des informations concernant le centre ou les cours proposés), il vous suffit de modifier l’annonce au lieu de créer une nouvelle publication.</p>
                        </section>

                        <section>
                            <h3>4- Activités interdites</h3>
                            <p>Afin de garantir un service de qualité et de protéger la communauté centres.ma contre les abus, il est essentiel de respecter les règles suivantes. L’utilisation de ce site est strictement interdite pour les actions suivantes :</p>
                            <ul>
                                <li>i. Placer une annonce ou transmettre un message sous une adresse e-mail ou un identifiant contenant des informations personnelles d’un individu qui ne souhaite pas que celles-ci apparaissent sur ce site.</li>
                                <li>ii. Placer une annonce ou un message qui soit faux, diffamatoire, abusif, haineux, obscène, pornographique, offensant, ou de toute autre nature inappropriée (tel que jugé à notre seule discrétion). Ceci inclut les messages ou annonces qui encouragent des comportements illégaux, violent ou criminels, divulguent des informations privées, violent la vie privée d’une personne, ou qui contiennent un virus, un malware ou tout autre code nuisible, ainsi que ceux qui perturbent le bon fonctionnement de centres.ma ou l’accès au site par les utilisateurs.</li>
                                <li>iii. Placer une annonce ou transmettre un message visant à vendre des produits illégaux, tels que des contrefaçons, des médicaments non autorisés, des armes, des organes humains, ou tout autre produit ou service dont la vente, la distribution ou la divulgation est soumise à des régulations spécifiques (y compris des produits dangereux, des billets de loterie, des adresses électroniques ou postales, etc.).</li>
                                <li>iv. Promouvoir des activités telles que les jeux de hasard, la prostitution, ou toute activité à caractère sexuel. Ces activités sont strictement interdites sur centres.ma.</li>
                            </ul>
                            <p>Notre équipe se réserve le droit de retirer toute annonce ou message ne respectant pas ces règles, et rappelle que ces actes peuvent constituer des infractions passibles de poursuites judiciaires conformément au Code pénal marocain. centres.ma ne pourra être tenu responsable du contenu des annonces ou messages publiés par ses utilisateurs.</p>
                        </section>

                        <section>
                            <h3>5- Déni de garantie</h3>
                            <p>centres.ma décline toute responsabilité concernant la précision, le contenu, l'exhaustivité, la légitimité, la fiabilité, l'opérabilité ou la disponibilité des informations ou des données affichées sur notre site, y compris celles fournies par les utilisateurs dans les annonces. Nous ne sommes pas responsables de la suppression, de l'impossibilité de stockage, de la transmission incorrecte ou de la transmission intempestive de ces informations ou données.</p>
                            <p>Nos services sont fournis "tels quels", sans aucune garantie. centres.ma exclut expressément, dans toute la mesure permise par la législation applicable, toutes garanties explicites, implicites et légales, y compris mais sans se limiter aux garanties de succès commercial, d'adaptation à un objet spécifique et de non-infraction des droits de propriété. Nous n’offrons aucune garantie concernant la sécurité, la fiabilité, l'opportunité et la performance de nos services.</p>
                            <p>Nous ne garantissons en aucun cas l'exactitude, la qualité, ou la validité des informations, conseils ou services obtenus via notre plateforme. De même, nous ne garantissons pas les services ou produits reçus via des annonces sur centres.ma, ni la véracité des avis laissés par les utilisateurs.</p>
                            <p>Certaines juridictions ne permettant pas l'exclusion des garanties implicites, il est possible que les exclusions ci-dessus ne s'appliquent pas dans votre cas. Vous pourriez bénéficier d'autres droits, qui varient selon les juridictions et les pays.</p>
                        </section>

                        <section>
                            <h3>6- Limites de responsabilité</h3>
                            <p>centres.ma ne pourra en aucun cas être tenu responsable vis-à-vis d’un utilisateur concernant l’utilisation ou l’utilisation incorrecte des services de notre site. En cas de réclamations relatives à cet accord ou au sujet traité, ces limites de responsabilité s'appliqueront afin de restreindre les demandes de dommages directs, indirects, incidents, conséquents, spéciaux, exemplaires ou punitifs – que ces demandes soient fondées sur une garantie, un contrat, des préjudices (y compris négligence) ou autres, même si notre plateforme a été avertie de la possibilité de tels dommages.</p>
                            <p>Ces limites de responsabilité s'appliqueront quelles que soient les causes des dommages (y compris les dommages causés à des tiers) : utilisation ou mauvaise utilisation de nos services, dépendance à ces services, impossibilité d'utiliser nos services, ou encore interruption, suspension ou arrêt temporaire ou définitif des services de centres.ma. Elles s'appliqueront également aux dommages liés aux services ou biens reçus via (ou promus par) notre site, ou via les liens proposés par nos services, ainsi qu’à toute information ou conseil reçu par ces liens.</p>
                            <p>Les limites de responsabilité incluent également, sans restriction, les coûts liés à l’acquisition de biens ou services de remplacement, ainsi que les pertes de bénéfices ou de données. Elles s'appliqueront également à la performance ou à la non-performance des services de ce site, des informations ou biens présentés dans les résultats proposés par centres.ma, ou liés de quelque manière que ce soit à ces résultats.</p>
                            <p>Ces limites de responsabilité s’appliqueront même si l’objet essentiel des recours limités échoue et dans la mesure permise par les lois en vigueur.</p>
                            <p>Certaines juridictions ou certains pays n'autorisant pas l'exclusion ou la limitation de la responsabilité pour les dommages incidentels ou conséquents, il est possible que les exclusions et limitations ci-dessus ne vous concernent pas. Dans ce cas, si nous ne pouvons pas limiter notre responsabilité, l'étendue de cette responsabilité sera limitée au minimum autorisé par la loi.</p>
                            <p>Enfin, centres.ma ne saurait être tenu responsable des retards ou baisses de performance résultant directement ou indirectement de circonstances échappant à notre contrôle raisonnable, telles que les problèmes spécifiques au réseau Internet, les pannes d'équipements informatiques, les défaillances des réseaux ou équipements de télécommunication, les pannes d'autres équipements, les pannes de courant, les grèves, les conflits sociaux, les émeutes, les troubles de l’ordre public, la pénurie de personnel ou d’équipements, les catastrophes naturelles (incendies, inondations, tempêtes, etc.), les cas de force majeure, la guerre, les actions gouvernementales, les injonctions judiciaires, les résultats insuffisants d’une ou plusieurs tierces parties, et toute perte ou fluctuation de conditions environnementales (chaleur, lumière, climatisation, etc.).</p>
                        </section>

                        <section>
                            <h3>7- Droit d'accès et de rectification de vos données personnelles</h3>
                            <p>Conformément à la loi 09-08 promulguée par le Dahir 1-09-15 du 18 février 2009 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition concernant les données personnelles vous concernant. Vous pouvez exercer ce droit en envoyant une demande par email à l’adresse suivante : support@centres.ma.</p>
                            <p>Si vos données personnelles sont incorrectes ou ont changé, il est de votre responsabilité de les mettre à jour sans délai via votre compte ou en contactant notre service clients à l’adresse email support@centres.ma. Nous procéderons à la modification de vos informations personnelles dès que possible.</p>
                            <p>Dans le cas où vous souhaitez supprimer votre compte, nous fermerons celui-ci et retirerons vos données personnelles des sections publiques du site dans les plus brefs délais, en fonction des activités liées à votre compte et conformément aux exigences légales en vigueur. Toutefois, centres.ma se réserve le droit de conserver les données personnelles des comptes fermés afin de se conformer aux obligations légales en vigueur, prévenir les fraudes, résoudre d'éventuels litiges, traiter toute enquête, faire appliquer nos conditions générales d'utilisation ou prendre toute autre action permise par la loi.</p>
                        </section>

                        <section>
                            <h3>8- Sécurité</h3>
                            <p>Les données que vous fournissez sont stockées sur les serveurs de notre hébergeur situés en Allemagne. Nous considérons vos données personnelles comme un actif précieux qui doit être protégé. Nous mettons en place des mesures techniques et organisationnelles afin de garantir leur sécurité et éviter tout accès non autorisé, perte, modification ou divulgation.</p>
                            <p>Cependant, il est important de noter qu'aucune méthode de transmission sur Internet ou de stockage électronique n'est entièrement sécurisée. En conséquence, bien que nous fassions tout notre possible pour protéger vos informations personnelles, nous ne pouvons pas garantir leur sécurité absolue. Des tiers peuvent, en théorie, intercepter des communications privées ou y accéder de manière illégale, et certains utilisateurs pourraient en faire une utilisation abusive.</p>
                            <p>Nous nous engageons à respecter votre vie privée autant que possible, mais nous ne pouvons pas garantir que vos données personnelles ou communications restent toujours protégées contre des accès non autorisés.</p>
                        </section>

                        <section>
                            <h3>9- Tiers</h3>
                            <p>Sauf disposition contraire spécifiée dans notre politique de confidentialité, ce document s'applique uniquement à l'utilisation et la divulgation des données que nous collectons directement de votre part. Si vous choisissez de partager vos données personnelles avec d'autres utilisateurs sur notre site, application ou services, ou sur d'autres sites web, des règles différentes peuvent s'appliquer en matière d'utilisation et de divulgation des informations que vous leur fournissez.</p>
                            <p>centres.ma n'exerce aucun contrôle sur les politiques de confidentialité des tiers et vous êtes donc soumis aux règles en vigueur sur leurs plateformes. Nous vous recommandons vivement de vous renseigner sur leurs pratiques en matière de protection des données avant de partager vos informations personnelles.</p>
                        </section> 

                        <section>
                            <h3>10- Votre relation avec centres.ma</h3>
                            <p>Vous et centres.ma êtes contractuellement indépendants l'un de l'autre, et ces termes ne doivent en aucun cas être interprétés comme une association ou un partenariat entre nous. Vous ne pouvez en aucun cas suggérer que centres.ma cautionne vos annonces, produits, services ou votre personne. Vous ne pouvez pas non plus encadrer ce site (ou toute information contenue dans ce site) ni créer une bordure autour de ce site ou de son contenu.</p>
                        </section>

                        <section>
                            <h3>11- Juridiction compétente</h3>
                            <p>Les présentes conditions d'utilisation de centres.ma sont régies par le droit marocain. Tout litige relatif à leur interprétation ou leur exécution sera de la compétence exclusive des tribunaux de Salé.</p>
                        </section>

                    </div>
                </div>
            <Footer /> 
        </main>
    )
}

