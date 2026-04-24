import { Building2 } from 'lucide-react'
import { LegalTemplate } from '@/pages/legal/LegalTemplate'

const SECTIONS = [
  {
    heading: 'Éditeur du site',
    content: [
      'Raison sociale : Loot SARL',
      'Capital social : 100 000 DH',
      'Registre du Commerce : Casablanca — RC N° 123456',
      'Identifiant Commun de l\'Entreprise (ICE) : 001234567890123',
      'Siège social : 123 Boulevard Anfa, Casablanca 20000, Maroc',
      'Téléphone : +212 5 22 00 00 00',
      'Email : contact@loot.ma',
      'Directeur de la publication : Youssef Alami',
    ],
  },
  {
    heading: 'Hébergement',
    content: [
      'Hébergeur : OVHcloud',
      'Adresse : 2 rue Kellermann, 59100 Roubaix, France',
      'Site : www.ovhcloud.com',
      'Téléphone : +33 9 72 10 10 07',
    ],
  },
  {
    heading: 'Propriété intellectuelle',
    content: 'L\'ensemble du contenu du site Loot (textes, images, graphismes, logo, icônes, sons, logiciels) constitue une œuvre protégée par les lois marocaines et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l\'autorisation préalable et écrite de Loot SARL.',
  },
  {
    heading: 'Marques déposées',
    content: 'Le nom Loot et son logo sont des marques déposées auprès de l\'Office Marocain de la Propriété Industrielle et Commerciale (OMPIC). Toute utilisation sans autorisation préalable est susceptible de poursuites judiciaires.',
  },
  {
    heading: 'Liens hypertextes',
    content: 'Le site peut contenir des liens vers des sites tiers. Loot n\'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu. La création de liens hypertextes vers loot.ma est soumise à l\'autorisation préalable écrite de Loot SARL.',
  },
  {
    heading: 'Données personnelles',
    content: 'Conformément à la Loi n° 09-08 relative à la protection des personnes physiques à l\'égard du traitement des données à caractère personnel, vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, contactez-nous à : privacy@loot.ma.',
  },
  {
    heading: 'Cookies',
    content: 'Le site utilise des cookies pour améliorer votre expérience de navigation. Certains cookies sont strictement nécessaires au fonctionnement du site, d\'autres sont utilisés à des fins statistiques ou de personnalisation. Vous pouvez paramétrer votre navigateur pour refuser les cookies non essentiels.',
  },
  {
    heading: 'Droit applicable',
    content: 'Le présent site est soumis au droit marocain. Tout litige relatif à son utilisation sera de la compétence exclusive des tribunaux de Casablanca, Maroc.',
  },
]

export function LegalPage() {
  return (
    <LegalTemplate
      title="Mentions Légales"
      subtitle="Informations légales relatives au site Loot.ma"
      lastUpdated="1er janvier 2025"
      icon={<Building2 className="h-6 w-6" />}
      sections={SECTIONS}
    />
  )
}
