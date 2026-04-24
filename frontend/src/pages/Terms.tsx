import { FileText } from 'lucide-react'
import { LegalTemplate } from '@/pages/legal/LegalTemplate'

const SECTIONS = [
  {
    heading: 'Objet et champ d\'application',
    content: 'Les présentes Conditions Générales de Vente (CGV) régissent toutes les ventes de produits effectuées sur le site Loot (loot.ma), exploité par Loot SARL, société de droit marocain au capital de 100 000 DH, immatriculée au RC de Casablanca. Toute commande passée sur le site implique l\'acceptation pleine et entière des présentes CGV.',
  },
  {
    heading: 'Produits et prix',
    content: [
      'Les produits proposés à la vente sont ceux figurant sur le site au moment de la commande.',
      'Les prix sont exprimés en Dirhams Marocains (DH), toutes taxes comprises (TVA 20 %).',
      'Loot se réserve le droit de modifier ses prix à tout moment, sans préavis.',
      'Les prix affichés lors de la validation de la commande sont contractuels.',
      'Les photographies sont non contractuelles et peuvent différer légèrement du produit livré.',
    ],
  },
  {
    heading: 'Commande et confirmation',
    content: [
      'La commande est validée après confirmation du paiement ou acceptation du paiement à la livraison.',
      'Un email de confirmation est envoyé dans les 30 minutes suivant la validation.',
      'Loot se réserve le droit de refuser toute commande en cas de rupture de stock ou de suspicion de fraude.',
      'Le client peut modifier ou annuler sa commande dans les 2 heures suivant la validation, si elle n\'a pas encore été préparée.',
    ],
  },
  {
    heading: 'Modes de paiement',
    content: [
      'Paiement à la livraison (cash) : disponible partout au Maroc.',
      'Virement bancaire : coordonnées communiquées après validation de la commande.',
      'Carte bancaire (Visa/Mastercard) : paiement sécurisé via une plateforme certifiée PCI-DSS.',
      'Les données bancaires ne sont jamais stockées sur nos serveurs.',
    ],
  },
  {
    heading: 'Livraison',
    content: [
      'La livraison est effectuée à l\'adresse indiquée lors de la commande.',
      'Les délais indicatifs sont de 24h à 72h selon la zone géographique (voir page Livraison).',
      'La livraison est gratuite pour toute commande supérieure à 500 DH.',
      'En cas d\'absence, un avis de passage est laissé et une nouvelle tentative est effectuée le lendemain.',
    ],
  },
  {
    heading: 'Droit de rétractation',
    content: 'Conformément à la législation marocaine en vigueur, le client dispose d\'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier de motifs. Le produit doit être retourné dans son emballage d\'origine, en parfait état, avec tous ses accessoires. Les frais de retour sont à la charge du client, sauf en cas de produit défectueux.',
  },
  {
    heading: 'Garanties',
    content: [
      'Garantie légale de conformité : 2 ans pour tout défaut de conformité.',
      'Garantie contre les vices cachés : selon les dispositions du Code des Obligations et Contrats marocain.',
      'Garantie commerciale constructeur : durée variable selon la marque et le produit (indiquée sur chaque fiche).',
      'En cas de panne sous garantie, contacter notre SAV dans les 48h suivant la constatation du défaut.',
    ],
  },
  {
    heading: 'Responsabilité',
    content: 'Loot ne saurait être tenu responsable des dommages indirects liés à l\'utilisation des produits vendus. Notre responsabilité est limitée au montant de la commande concernée. Loot n\'est pas responsable des retards de livraison causés par des événements de force majeure.',
  },
  {
    heading: 'Protection des données',
    content: 'Les informations collectées lors de la commande sont nécessaires à son traitement et à la livraison. Elles ne sont en aucun cas cédées à des tiers à des fins commerciales. Pour plus d\'informations, consultez notre Politique de Confidentialité.',
  },
  {
    heading: 'Droit applicable et litiges',
    content: 'Les présentes CGV sont soumises au droit marocain. En cas de litige, les parties s\'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut d\'accord amiable, les tribunaux de Casablanca seront seuls compétents.',
  },
]

export function TermsPage() {
  return (
    <LegalTemplate
      title="Conditions Générales de Vente"
      subtitle="Règles régissant les achats effectués sur Loot.ma"
      lastUpdated="1er janvier 2025"
      icon={<FileText className="h-6 w-6" />}
      sections={SECTIONS}
    />
  )
}
