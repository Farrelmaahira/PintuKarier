export interface Cell {
  x: number;
  y: number;
  color: string;
  alpha: number;
}

export const GRID_COLORS = ["#55db9c", "#00bfff", "#7a69fa"];

/** Susun sel persegi memenuhi area; 7 kolom di layar sempit, 28 di layar lebar. */
export function buildCells(width: number, height: number) {
  const columns = width < 768 ? 7 : 28;
  const size = width / columns;
  const rows = Math.ceil(height / size);
  const cells: Cell[] = [];
  for (let row = 0; row < rows; row++)
    for (let column = 0; column < columns; column++) cells.push({ x: column * size, y: row * size, color: "#fff", alpha: 0 });
  return { cells, size, columns };
}

/** Gambar garis grid dan isi warna sel yang sedang menyala. */
export function drawCells(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, cells: Cell[], size: number) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 1.5;
  context.strokeStyle = "rgba(77,162,255,0.35)";
  for (const cell of cells) {
    if (cell.alpha > 0) {
      context.globalAlpha = cell.alpha;
      context.fillStyle = cell.color;
      context.fillRect(cell.x, cell.y, size, size);
      context.globalAlpha = 1;
    }
    context.strokeRect(cell.x, cell.y, size, size);
  }
}
