import { Lock } from 'lucide-react'
import { LegalTemplate } from '@/pages/legal/LegalTemplate'

const SECTIONS = [
  {
    heading: 'Responsable du traitement',
    content: 'Loot SARL, 123 Boulevard Anfa, Casablanca 20000, Maroc — contact : privacy@loot.ma. Nous traitons vos données conformément à la Loi n° 09-08 relative à la protection des données personnelles au Maroc et au RGPD européen pour nos visiteurs résidant en Europe.',
  },
  {
    heading: 'Données collectées',
    content: [
      'Données d\'identification : nom, prénom, adresse email, numéro de téléphone.',
      'Données de livraison : adresse postale, ville, code postal.',
      'Données de navigation : adresse IP, cookies, pages visitées, durée de session.',
      'Données de paiement : les coordonnées bancaires ne sont pas stockées sur nos serveurs.',
      'Historique de commandes : référence, date, montant, produits achetés.',
    ],
  },
  {
    heading: 'Finalités du traitement',
    content: [
      'Traitement et suivi de vos commandes.',
      'Gestion de votre compte client et de l\'authentification.',
      'Envoi de communications transactionnelles (confirmation, livraison, SAV).',
      'Amélioration de nos services et analyse du comportement de navigation (anonymisé).',
      'Envoi de communications marketing (uniquement avec votre consentement).',
      'Prévention de la fraude et sécurité de la plateforme.',
    ],
  },
  {
    heading: 'Base légale',
    content: [
      'Exécution du contrat : traitement des commandes et livraison.',
      'Obligations légales : facturation, comptabilité, obligations fiscales.',
      'Intérêts légitimes : prévention de la fraude, amélioration du service.',
      'Consentement : communications marketing (révocable à tout moment).',
    ],
  },
  {
    heading: 'Durée de conservation',
    content: [
      'Données de compte actif : pendant toute la durée de la relation commerciale.',
      'Données de commande : 10 ans (obligation légale comptable).',
      'Cookies analytiques : 13 mois maximum.',
      'Données inactives : supprimées après 3 ans d\'inactivité du compte.',
    ],
  },
  {
    heading: 'Partage des données',
    content: [
      'Transporteurs et partenaires logistiques : pour la livraison de vos commandes.',
      'Prestataires de paiement : pour le traitement des transactions.',
      'Hébergeur (OVHcloud) : stockage sécurisé des données.',
      'Autorités compétentes : uniquement sur réquisition judiciaire.',
      'Aucune cession ou vente de données à des tiers à des fins commerciales.',
    ],
  },
  {
    heading: 'Cookies et traceurs',
    content: [
      'Cookies strictement nécessaires : authentification, panier, préférences de session.',
      'Cookies analytiques (Google Analytics) : mesure d\'audience anonymisée.',
      'Cookies de personnalisation : mémorisation de vos préférences.',
      'Vous pouvez gérer vos préférences de cookies via la bannière de consentement.',
      'Pour refuser tous les cookies, configurez votre navigateur en conséquence.',
    ],
  },
  {
    heading: 'Vos droits',
    content: [
      'Droit d\'accès : obtenir une copie de vos données personnelles.',
      'Droit de rectification : corriger des données inexactes ou incomplètes.',
      'Droit à l\'effacement : demander la suppression de vos données.',
      'Droit à la limitation : restreindre le traitement de vos données.',
      'Droit à la portabilité : recevoir vos données dans un format structuré.',
      'Droit d\'opposition : vous opposer au traitement à des fins marketing.',
      'Pour exercer vos droits : privacy@loot.ma — réponse sous 30 jours.',
    ],
  },
  {
    heading: 'Sécurité',
    content: 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, divulgation, modification ou destruction. Le site utilise le protocole HTTPS pour chiffrer toutes les communications.',
  },
]

export function PrivacyPage() {
  return (
    <LegalTemplate
      title="Politique de Confidentialité"
      subtitle="Comment nous collectons, utilisons et protégeons vos données"
      lastUpdated="1er janvier 2025"
      icon={<Lock className="h-6 w-6" />}
      sections={SECTIONS}
    />
  )
}
