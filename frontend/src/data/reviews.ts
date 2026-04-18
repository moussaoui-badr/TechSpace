import type { Review } from '@/types'

export const reviews: Review[] = [
  // Ryzen 7 7800X3D (1)
  {
    id: 1,
    productId: 1,
    userName: 'Yassine B.',
    rating: 5,
    comment: 'Perf de ouf en gaming, surtout sur Cyberpunk et MS Flight Sim. Aucune chauffe avec un AIO 360.',
    createdAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 2,
    productId: 1,
    userName: 'Soukaina M.',
    rating: 5,
    comment: 'Le CPU gaming par excellence. Paiement a la livraison, recu en 2 jours a Rabat.',
    createdAt: '2026-03-05T09:12:00Z',
  },
  {
    id: 3,
    productId: 1,
    userName: 'Omar K.',
    rating: 4,
    comment: 'Excellent mais un peu plus cher que prevu. Les perfs compensent largement.',
    createdAt: '2026-02-28T18:00:00Z',
  },

  // RTX 4070 Ti SUPER (5)
  {
    id: 4,
    productId: 5,
    userName: 'Mehdi A.',
    rating: 5,
    comment: '1440p Ultra sans broncher. Le design TUF est sublime, tres silencieux au repos.',
    createdAt: '2026-03-08T11:45:00Z',
  },
  {
    id: 5,
    productId: 5,
    userName: 'Karim L.',
    rating: 5,
    comment: 'Upgrade depuis une 3070 : x2 en perf reels sur tous mes jeux. Top.',
    createdAt: '2026-03-01T15:20:00Z',
  },
  {
    id: 6,
    productId: 5,
    userName: 'Salma R.',
    rating: 4,
    comment: 'Grosse carte, verifiez la place dans votre boitier. Livraison au top.',
    createdAt: '2026-02-25T08:10:00Z',
  },

  // Corsair Vengeance DDR5 (9)
  {
    id: 7,
    productId: 9,
    userName: 'Anas D.',
    rating: 5,
    comment: 'Profil EXPO active, zero souci sur X670. 6000 MHz CL30 stable direct.',
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 8,
    productId: 9,
    userName: 'Hicham T.',
    rating: 5,
    comment: 'Prix correct et perfs au rendez-vous. Je recommande.',
    createdAt: '2026-02-15T19:30:00Z',
  },

  // Samsung 990 Pro 2TB (11)
  {
    id: 9,
    productId: 11,
    userName: 'Rania F.',
    rating: 5,
    comment: 'Debits de fou, Windows boote en 6 secondes. 2 To c est le minimum aujourd hui.',
    createdAt: '2026-02-18T14:20:00Z',
  },
  {
    id: 10,
    productId: 11,
    userName: 'Walid S.',
    rating: 5,
    comment: 'Parfait pour mon build, temperatures maitrisees avec un dissipateur M.2.',
    createdAt: '2026-02-10T12:00:00Z',
  },

  // TechSpace Gamer Intel (22)
  {
    id: 11,
    productId: 22,
    userName: 'Anouar E.',
    rating: 5,
    comment: 'Config livree testee, cable management impeccable, facture + garantie 2 ans. Service au top.',
    createdAt: '2026-03-12T16:45:00Z',
  },
  {
    id: 12,
    productId: 22,
    userName: 'Hamza B.',
    rating: 5,
    comment: 'Equipe tres pro sur Casablanca, on m a explique chaque composant. Parfaite pour le 1440p Ultra.',
    createdAt: '2026-03-05T11:00:00Z',
  },

  // TechSpace Ultimate Intel i9 + RTX 4080 SUPER (23)
  {
    id: 21,
    productId: 23,
    userName: 'Reda M.',
    rating: 5,
    comment: 'Station de reve : 4K path-tracing fluide, watercooling LCD magnifique. Livraison Casa en 48h, zero rayure.',
    createdAt: '2026-04-02T10:15:00Z',
  },
  {
    id: 22,
    productId: 23,
    userName: 'Sofia T.',
    rating: 5,
    comment: 'Montage impeccable, cable management soigne. Le boitier verre trempe fait son effet sur le bureau.',
    createdAt: '2026-03-25T17:40:00Z',
  },
  {
    id: 23,
    productId: 23,
    userName: 'Hassan O.',
    rating: 4,
    comment: 'Perf au rendez-vous, mais la config est bruyante en charge maximale. Rien de dramatique, le LCD compense.',
    createdAt: '2026-03-18T14:20:00Z',
  },

  // ASUS ROG Strix G16 (25)
  {
    id: 13,
    productId: 25,
    userName: 'Ilyas N.',
    rating: 5,
    comment: 'Ecran 240 Hz absolument magnifique, le clavier RGB c est la cerise. Ventilos discrets.',
    createdAt: '2026-03-02T09:30:00Z',
  },
  {
    id: 14,
    productId: 25,
    userName: 'Fatima Z.',
    rating: 4,
    comment: 'Tres bon portable gamer. Chauffe un peu en jeu mais rien d anormal.',
    createdAt: '2026-02-22T17:00:00Z',
  },

  // MSI MAG 274UPF (29)
  {
    id: 15,
    productId: 29,
    userName: 'Youssef M.',
    rating: 5,
    comment: 'Ecran 4K 144 Hz au meilleur prix du marche. Couleurs IPS superbes, HDR correct.',
    createdAt: '2026-02-28T13:15:00Z',
  },
  {
    id: 16,
    productId: 29,
    userName: 'Nadia C.',
    rating: 5,
    comment: 'Je l utilise pour du montage + gaming, polyvalent et tres bien calibre d usine.',
    createdAt: '2026-02-15T10:40:00Z',
  },

  // Logitech G Pro X Superlight 2 (32)
  {
    id: 17,
    productId: 32,
    userName: 'Zakaria R.',
    rating: 5,
    comment: 'Ultra legere, reactive, autonomie longue. La meilleure souris esport aujourd hui.',
    createdAt: '2026-03-06T20:00:00Z',
  },
  {
    id: 18,
    productId: 32,
    userName: 'Lina K.',
    rating: 5,
    comment: 'Parfaite pour Valorant, je grimpe en elo depuis que je l ai.',
    createdAt: '2026-02-27T18:30:00Z',
  },

  // HyperX Cloud III (36)
  {
    id: 19,
    productId: 36,
    userName: 'Ayoub S.',
    rating: 5,
    comment: 'Confort incroyable sur 6h de jeu. Le micro rend bien en stream.',
    createdAt: '2026-03-01T22:10:00Z',
  },

  // PS5 Slim (38)
  {
    id: 20,
    productId: 38,
    userName: 'Imane B.',
    rating: 5,
    comment: 'Version slim beaucoup plus discrete, meme perfs que l originale. Cash a la livraison OK.',
    createdAt: '2026-02-25T15:00:00Z',
  },
]

export function findReviewsByProductId(productId: number): Review[] {
  return reviews.filter((r) => r.productId === productId)
}
