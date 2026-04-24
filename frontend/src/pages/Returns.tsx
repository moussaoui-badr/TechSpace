import { RefreshCw } from 'lucide-react'
import { LegalTemplate } from '@/pages/legal/LegalTemplate'

const SECTIONS = [
  {
    heading: 'Conditions générales de retour',
    content: [
      'Délai de rétractation : 14 jours à compter de la réception du produit.',
      'Le produit doit être retourné dans son emballage d\'origine, non utilisé et avec tous ses accessoires.',
      'Les produits ouverts (logiciels, jeux vidéo scellés) ne peuvent pas être retournés sauf défaut.',
      'Les retours pour erreur de notre part sont entièrement pris en charge (frais de transport inclus).',
      'Les retours pour changement d\'avis sont à la charge du client (frais de transport).',
    ],
  },
  {
    heading: 'Procédure de retour',
    content: [
      'Étape 1 : Contactez notre SAV par email (sav@loot.ma) ou WhatsApp (+212 6 00 00 00 00).',
      'Étape 2 : Obtenez un numéro de retour (RMA) — obligatoire pour tout retour.',
      'Étape 3 : Emballez soigneusement le produit et inscrivez le numéro RMA sur le colis.',
      'Étape 4 : Déposez le colis au transporteur ou planifiez un enlèvement à domicile.',
      'Étape 5 : Nous accusons réception sous 24h et procédons au contrôle du produit.',
    ],
  },
  {
    heading: 'Délai de remboursement',
    content: [
      'Remboursement par virement bancaire : sous 5 à 7 jours ouvrés après réception du retour.',
      'Remboursement par avoir sur votre compte Loot : immédiat après réception.',
      'En cas de paiement par carte bancaire, le remboursement suit le délai de votre banque (2 à 5 jours).',
    ],
  },
  {
    heading: 'Produits défectueux',
    content: [
      'Tout défaut doit être signalé dans les 48 heures suivant la constatation.',
      'Envoyez des photos/vidéos du défaut à sav@loot.ma pour accélérer le traitement.',
      'Les frais de retour et de renvoi sont entièrement à notre charge.',
      'Selon le défaut, nous proposons : réparation, échange à l\'identique ou remboursement intégral.',
    ],
  },
  {
    heading: 'Garantie légale de conformité',
    content: 'Conformément à la législation marocaine, tous nos produits bénéficient d\'une garantie légale de conformité de 2 ans à compter de la date d\'achat. Durant cette période, tout défaut de conformité avéré sera pris en charge sans frais supplémentaires pour le client.',
  },
  {
    heading: 'Garantie contre les vices cachés',
    content: 'Si un vice caché est découvert, vous pouvez, selon l\'article 549 du Code des Obligations et Contrats marocain, choisir entre restituer le produit (avec remboursement du prix payé) ou le conserver (avec réduction du prix). L\'action doit être intentée dans un délai raisonnable après la découverte du vice.',
  },
  {
    heading: 'Garantie commerciale constructeur',
    content: [
      'En complément de la garantie légale, les fabricants proposent souvent une garantie commerciale.',
      'Durée variable : 1 an (la plupart des produits) à 3 ans (moniteurs, disques durs certains fabricants).',
      'La durée exacte est indiquée sur chaque fiche produit et sur l\'emballage.',
      'La garantie constructeur couvre généralement les pannes dues à un défaut de fabrication.',
      'Elle ne couvre pas les dommages causés par une mauvaise utilisation ou un accident.',
    ],
  },
  {
    heading: 'Produits exclus des retours',
    content: [
      'Logiciels dont le sceau a été brisé.',
      'Cartes cadeau et bons d\'achat.',
      'Produits personnalisés ou configurés sur mesure.',
      'Consommables (cartouches d\'encre, pâte thermique, etc.) utilisés.',
      'Produits dont l\'emballage a subi des dégradations importantes.',
    ],
  },
]

export function ReturnsPage() {
  return (
    <LegalTemplate
      title="Retours & Garantie"
      subtitle="Tout savoir sur nos politiques de retour et de garantie produits"
      lastUpdated="1er janvier 2025"
      icon={<RefreshCw className="h-6 w-6" />}
      sections={SECTIONS}
    />
  )
}
