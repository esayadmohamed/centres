import Link from 'next/link';

export default function NotFound() {

    return (
        <div className="notfoundmain">
            
            <div className="notfoundsub">
                <p className="notfoundError">Erreur 404 </p>
                <p className="notfoundMessage"> 
                    La page que vous recherchez n'existe pas.
                </p>
                <Link href={'/'}>
                    <p> Revenir à la page d’accueil </p>
                </Link>
            </div>

        </div>
    )

}
