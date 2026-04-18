/**
 * Script one-shot : exporte les mock data du frontend en JSON pour le seed backend.
 * A executer depuis frontend/ : `npx tsx tools/export-seed.mts`
 * Les JSON sont ecrits dans backend/TechSpace.Api/SeedData/.
 * Ne pas re-executer si le seed a ete modifie cote backend.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { products } from '../src/data/products'
import { categories } from '../src/data/categories'
import { brands } from '../src/data/brands'
import { banners } from '../src/data/banners'
import { reviews } from '../src/data/reviews'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../../backend/TechSpace.Api/SeedData')

mkdirSync(outDir, { recursive: true })

function write(name: string, data: unknown) {
  const file = path.join(outDir, `${name}.json`)
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
  console.log(`  [+] ${name}.json`)
}

console.log(`Export seed -> ${outDir}`)
write('brands', brands)
write('categories', categories)
write('products', products)
write('banners', banners)
write('reviews', reviews)
console.log('Done.')
