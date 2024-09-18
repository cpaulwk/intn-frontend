export function formatUpvoteCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else if (count < 1000000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  } else {
    return (count / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
  }
}
