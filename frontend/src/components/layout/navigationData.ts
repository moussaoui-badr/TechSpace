/**
 * Navigation statique du Header / sidebar Home / MegaMenu.
 * Structure calquée sur les 13 catégories principales de Newegg.com.
 */

export interface NavCategory {
  slug: string
  label: string
  description?: string
  imageUrl?: string
  children: NavChild[]
}

export interface NavChild {
  slug: string
  label: string
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    slug: 'components-storage',
    label: 'Composants & Stockage',
    description: 'Processeurs, cartes graphiques, mémoire et stockage.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Composants',
    children: [
      { slug: 'processeurs', label: 'Processeurs' },
      { slug: 'cartes-graphiques', label: 'Cartes graphiques' },
      { slug: 'memoire-ram', label: 'Mémoire RAM' },
      { slug: 'ssd', label: 'SSD' },
      { slug: 'disques-durs', label: 'Disques durs' },
      { slug: 'cartes-meres', label: 'Cartes mères' },
      { slug: 'alimentations', label: 'Alimentations' },
      { slug: 'boitiers', label: 'Boîtiers PC' },
    ],
  },
  {
    slug: 'computer-systems',
    label: 'Systèmes informatiques',
    description: 'PC de bureau, portables et stations de travail.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Systemes',
    children: [
      { slug: 'pc-gamer', label: 'PC Gamer' },
      { slug: 'pc-bureau', label: 'PC de bureau' },
      { slug: 'portables-gamer', label: 'Portables Gamer' },
      { slug: 'portables-bureautique', label: 'Portables Bureautique' },
      { slug: 'stations-travail', label: 'Stations de travail' },
      { slug: 'all-in-one', label: 'All-in-One' },
    ],
  },
  {
    slug: 'computer-peripherals',
    label: 'Périphériques',
    description: 'Claviers, souris, écrans, casques et accessoires.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Peripheriques',
    children: [
      { slug: 'ecrans', label: 'Écrans' },
      { slug: 'claviers', label: 'Claviers' },
      { slug: 'souris', label: 'Souris' },
      { slug: 'casques', label: 'Casques audio' },
      { slug: 'webcams', label: 'Webcams' },
      { slug: 'imprimantes', label: 'Imprimantes' },
    ],
  },
  {
    slug: 'server-components',
    label: 'Serveurs & Composants',
    description: 'Matériel serveur, stockage et virtualisation.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Serveurs',
    children: [
      { slug: 'serveurs', label: 'Serveurs' },
      { slug: 'stockage-serveur', label: 'Stockage serveur' },
      { slug: 'racks', label: 'Racks & baies' },
      { slug: 'cartes-serveur', label: 'Cartes serveur' },
      { slug: 'kvm', label: 'KVM & commutateurs' },
    ],
  },
  {
    slug: 'appliances',
    label: 'Électroménager',
    description: 'Gros et petit électroménager pour la maison.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Appliances',
    children: [
      { slug: 'refrigerateurs', label: 'Réfrigérateurs' },
      { slug: 'lave-linge', label: 'Lave-linge' },
      { slug: 'climatiseurs', label: 'Climatiseurs' },
      { slug: 'petit-electromenager', label: 'Petit électroménager' },
      { slug: 'aspirateurs', label: 'Aspirateurs' },
    ],
  },
  {
    slug: 'electronics',
    label: 'Électronique',
    description: 'TV, audio, appareils photo et accessoires.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Electronique',
    children: [
      { slug: 'televiseurs', label: 'Téléviseurs' },
      { slug: 'audio', label: 'Audio & Hi-Fi' },
      { slug: 'appareils-photo', label: 'Appareils photo' },
      { slug: 'smartphones', label: 'Smartphones' },
      { slug: 'tablettes', label: 'Tablettes' },
      { slug: 'montres-connectees', label: 'Montres connectées' },
    ],
  },
  {
    slug: 'gaming-vr',
    label: 'Gaming & VR',
    description: 'Consoles, jeux, VR et setups gamer.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Gaming',
    children: [
      { slug: 'console-ps5', label: 'PlayStation 5' },
      { slug: 'console-xbox', label: 'Xbox Series' },
      { slug: 'console-switch', label: 'Nintendo Switch' },
      { slug: 'jeux-video', label: 'Jeux vidéo' },
      { slug: 'casques-vr', label: 'Casques VR' },
      { slug: 'chaises-gamer', label: 'Chaises gamer' },
      { slug: 'bureaux-gamer', label: 'Bureaux gamer' },
    ],
  },
  {
    slug: 'networking',
    label: 'Réseaux',
    description: 'Routeurs, switchs, Wi-Fi mesh et câbles.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Reseaux',
    children: [
      { slug: 'routeurs', label: 'Routeurs' },
      { slug: 'wifi-mesh', label: 'Wi-Fi mesh' },
      { slug: 'switchs', label: 'Switchs réseau' },
      { slug: 'cartes-reseau', label: 'Cartes réseau' },
      { slug: 'cables-reseau', label: 'Câbles réseau' },
    ],
  },
  {
    slug: 'smart-home-security',
    label: 'Maison connectée & Sécurité',
    description: 'Domotique, caméras et alarmes.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Smart+Home',
    children: [
      { slug: 'cameras-surveillance', label: 'Caméras de surveillance' },
      { slug: 'sonnettes-video', label: 'Sonnettes vidéo' },
      { slug: 'alarmes', label: 'Alarmes' },
      { slug: 'serrures-connectees', label: 'Serrures connectées' },
      { slug: 'ampoules-connectees', label: 'Ampoules connectées' },
    ],
  },
  {
    slug: 'office-solutions',
    label: 'Solutions bureau',
    description: 'Mobilier, fournitures et équipement pro.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Bureau',
    children: [
      { slug: 'bureaux', label: 'Bureaux' },
      { slug: 'chaises-bureau', label: 'Chaises de bureau' },
      { slug: 'fournitures', label: 'Fournitures' },
      { slug: 'visioconference', label: 'Visioconférence' },
      { slug: 'projecteurs', label: 'Projecteurs' },
    ],
  },
  {
    slug: 'software-services',
    label: 'Logiciels & Services',
    description: 'Systèmes, sécurité, cloud et licences.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Logiciels',
    children: [
      { slug: 'windows', label: 'Windows' },
      { slug: 'office', label: 'Microsoft Office' },
      { slug: 'antivirus', label: 'Antivirus' },
      { slug: 'cloud', label: 'Stockage cloud' },
      { slug: 'vpn', label: 'VPN' },
    ],
  },
  {
    slug: 'automotive-tools',
    label: 'Auto & Outillage',
    description: 'Électronique embarquée, outils et diagnostic.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Auto',
    children: [
      { slug: 'autoradios', label: 'Autoradios' },
      { slug: 'dashcam', label: 'Dashcam' },
      { slug: 'gps', label: 'GPS' },
      { slug: 'outils-diagnostic', label: 'Outils diagnostic' },
      { slug: 'outillage', label: 'Outillage' },
    ],
  },
  {
    slug: 'home-outdoors',
    label: 'Maison & Extérieur',
    description: 'Jardin, bricolage et éclairage.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Maison',
    children: [
      { slug: 'jardin', label: 'Jardin' },
      { slug: 'bricolage', label: 'Bricolage' },
      { slug: 'camping', label: 'Camping' },
      { slug: 'eclairage', label: 'Éclairage' },
    ],
  },
  {
    slug: 'health-sports',
    label: 'Santé & Sport',
    description: 'Fitness, nutrition et bien-être connecté.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Sport',
    children: [
      { slug: 'fitness', label: 'Équipement fitness' },
      { slug: 'velos', label: 'Vélos & trottinettes' },
      { slug: 'nutrition', label: 'Nutrition' },
      { slug: 'sante-connectee', label: 'Santé connectée' },
    ],
  },
  {
    slug: 'toys-drones-maker',
    label: 'Jouets, Drones & Maker',
    description: 'Drones, imprimantes 3D, robotique et jouets tech.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Maker',
    children: [
      { slug: 'drones', label: 'Drones' },
      { slug: 'imprimantes-3d', label: 'Imprimantes 3D' },
      { slug: 'arduino-raspberry', label: 'Arduino & Raspberry' },
      { slug: 'robotique', label: 'Robotique' },
      { slug: 'jouets-tech', label: 'Jouets tech' },
    ],
  },
]
