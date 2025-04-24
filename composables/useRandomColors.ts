const colors = ['#FFF8F5', '#FFF3ED', '#FFEDE4', '#FFE8DC', '#FFE2D3']

export const useRandomColors = () => {
  const getRandomColor = (): string =>
    colors[Math.floor(Math.random() * colors.length)]

  return { getRandomColor }
}
