import React, { useState } from "react";
import "../styles/AideButton.css";

const AideButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant */}
      <button className="aide-btn" onClick={() => setIsOpen(true)}>
        ❓ Aide
      </button>

      {/* Popup modale */}
      {isOpen && (
        <div className="aide-overlay" onClick={() => setIsOpen(false)}>
          <div className="aide-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Aide - Mode d'emploi Benevol'Check</h2>
            <div className="aide-content">
              <p>
                A partir d'un smartphone ou d'un ordinateur, Benevol'Check permet
                d'éditer puis de conserver sous forme numérique une attestation
                simplifiée des compétences qu'un bénévole a mises en œuvre au
                service d'une association.
              </p>
              <p>
                Le bénévole pourra télécharger cette attestation pour la conserver 
                ou la transférer à toute personne de son choix. Elle témoigne de son 
                passage dans l'association avec un regard sur ses capacités d'adaptation, 
                d'initiative et d'action en équipe.
              </p>
              <p>
                L'association peut utiliser Benevol'Check pour remettre à ses bénévoles 
                un signe de reconnaissance en mettant à leur disposition ce document qui 
                met en valeur les savoir-faire qu'ils ont montrés au cours de leur activité associative. 
              </p>

                <p>Pour éditer un Benevol'Check </p>

              <h3>Si je suis responsable associatif</h3>
              <ul>
                <li>
                  Je crée le compte d'identification de l'association sur le
                  site Benevol'Check
                </li>
                <li>
                  Je demande aux bénévoles à qui je veux remettre un
                  Benevol'Check de s'inscrire sur le site.
                </li>
                <li>
                  Je prépare une attestation pour chacun des bénévoles concernés. Pour cela: 
                </li>
                <li>
                  J'identifie le bénévole concerné sur le site (recherche par nom) 
                </li>
                <li>
                  Je coche les cases qui correspondent aux comportements observés – Les savoir-faire correspondant aux cases que je ne coche pas n'apparaîtront pas sur l'attestation. 
                </li>
                <li>
                  J'informe les bénévoles qu'ils peuvent trouver leur Benevol'Check sur le site et le télécharger. 
                </li>
              </ul>

              <h3>Si je suis bénévole</h3>
              <ul>
                <li>Je crée mon compte sur le site Benevol'Check</li>
                <li>
                  Je demande au responsable de l'association si elle a ouvert un compte sur le site Benevol'Check, sinon, je lui demande de le faire. 
                </li>
                <li>
                  J'ouvre la page "attestation" et j'identifie l'association.
                </li>
                <li>
                  Je coche les cases qui me semblent correspondre à ce que j'ai fait et comment je pense l'avoir fait au cours de mon activité dans l'association 
                </li>
                <li>
                  Je sollicite le responsable associatif pour qu'il valide mon Benevol'Check 
                </li>
              </ul>

              <p>
                Après validation/correction du Benevol'Check par le responsable
                associatif, je recevrai un mail me disant que je peux consulter
                et télécharger mon Benevol'Check.
              </p>

              <p>
                Pour que le Benevol'Check soit édité en bonne entente, il est
                fortement conseillé de le préparer ensemble, entre le bénévole
                et le responsable associatif.
              </p>

              <p>
                Pour faciliter cet entretien, on peut utiliser avec intérêt les fiches "ma mission bénévole" et "aide à la rédaction" du Passeport bénévole® de France Bénévolat. 
              </p>

              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AideButton;
