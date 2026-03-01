export default <T> (array: T[], chunkSize: number): T[][] =>
  array.reduce<T[][]>((chunks, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
    chunks[chunkIndex].push(item);
    return chunks;
  }, []);