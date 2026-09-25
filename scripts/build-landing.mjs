// Кладёт страницу выбора версии в корень dist/ после сборки обоих приложений.
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

for (const app of ['react', 'vue']) {
  if (!existsSync(resolve(dist, app, 'index.html'))) {
    console.error(`Нет сборки dist/${app}. Сначала выполните npm run build.`);
    process.exit(1);
  }
}

mkdirSync(dist, { recursive: true });
copyFileSync(resolve(root, 'site/index.html'), resolve(dist, 'index.html'));
// Отключаем Jekyll на GitHub Pages, чтобы файлы с подчёркиванием не игнорировались
writeFileSync(resolve(dist, '.nojekyll'), '');
console.log('✓ dist/index.html готов');
