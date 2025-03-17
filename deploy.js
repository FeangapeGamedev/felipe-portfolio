import ghpages from 'gh-pages';
import { resolve } from 'path';

const distPath = resolve('dist');

ghpages.publish(distPath, {
  branch: 'gh-pages',
  repo: 'https://github.com/FeangapeGamedev/felipe-portfolio.git',
  dotfiles: true
}, (err) => {
  if (err) {
    console.error('Deployment failed:', err);
  } else {
    console.log('Deployment successful!');
  }
});