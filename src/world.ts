const world = '🗺️';

function hello(word: string = world): string {
  return `Hello ${word}! `;
}

console.log(hello('ciao'));