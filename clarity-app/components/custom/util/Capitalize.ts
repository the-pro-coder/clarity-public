export default function capitalize(text: string) {
  if (text.length < 1) return text;
  return text[0].toUpperCase() + text.substring(1);
}
