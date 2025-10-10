// utils/pseudonym.js
const adjectives = ["Brave", "Clever", "Silent", "Quick", "Happy", "Blue"];
const animals = ["Otter", "Fox", "Falcon", "Lion", "Wolf", "Swan"];

export function generatePseudonym() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj}${animal}${Math.floor(Math.random() * 1000)}`; // e.g., BraveOtter123
}