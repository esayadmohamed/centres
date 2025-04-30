import Link from 'next/link';

import Icon from '@/_lib/utils/Icon';

export default function NotFound() {

    return (
        <div className="notfoundmain">
            
            <div className="notfoundsub">
                <h2> <Icon name={'SearchX'} /> Erreur 404</h2>
                <p>{`La page que vous recherchez n'existe pas.`}</p>
                <Link href={'/'}>
                    <p> <Icon name={'ChevronLeft'} />
                        <span>{`Revenir à la page d'accueil.`}</span>
                    </p>
                </Link>
            </div>

        </div>
    )

}
