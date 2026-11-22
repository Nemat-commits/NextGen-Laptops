import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import HeroCarousel from '../src/components/HeroCarousel';

const hero=renderToStaticMarkup(<HeroCarousel/>);
assert.match(hero,/aria-roledescription="carousel"/);
assert.equal((hero.match(/<h1(?:\s|>)/g)||[]).length,1);
assert.match(hero,/hero-slide-words-stack/);
assert.equal((hero.match(/class="hero-slide-words(?: is-active)?"/g)||[]).length,3);
assert.match(hero,/Find the laptop/);
assert.match(hero,/01 \/ 03/);
assert.match(hero,/aria-label="Go to slide 1:/);
assert.match(hero,/aria-label="Go to slide 2:/);
assert.match(hero,/aria-label="Go to slide 3:/);
assert.doesNotMatch(hero,/aria-label="(?:Previous slide|Next slide|Pause slideshow)"/);
assert.match(hero,/href="\/shop"/);
assert.match(hero,/https:\/\/wa\.me\/923215744034/);
console.log('Hero carousel initial-render checks passed');
