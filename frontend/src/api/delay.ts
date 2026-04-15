/**
 * Simule une latence reseau pour les appels API mock.
 * En Phase 4, ces fonctions seront remplacees par des appels axios reels
 * et cette utilitaire pourra etre supprimee.
 */
export function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
