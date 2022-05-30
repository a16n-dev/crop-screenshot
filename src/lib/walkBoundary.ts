enum dir {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

/**
 * Wall follower algorithm to determine the perimiter of the image. Keeps track of the corner points as it goes
 * @param space
 * @returns the corner points of a rectange that encloses the area traversed by the algorithm
 */
export const walkBoundary = (space: number[][]) => {
  let cY = space.length / 2;
  let cX = space[0].length / 2;

  // Start by moving up until a boundary is hit
  while (true) {
    if ((space[cX] || [])[cY - 1]) {
      cY--;
    } else {
      break;
    }
  }

  let y = cY;
  let x = cX;

  let lastMove = dir.RIGHT;

  let moved = false;

  // Keep track of corner points of the rectangle enclosed by the boundary
  let minX, minY, maxX, maxY;

  while (true) {
    if (x === cX && y === cY && moved) {
      break;
    }

    if (lastMove === dir.RIGHT) {
      if ((space[x] || [])[y - 1]) {
        lastMove = dir.UP;
        y--;
        space[x][y] = 2;

        if (minY === undefined || y < minY) {
          minY = y;
        }

        moved = true;
      } else {
        lastMove = dir.DOWN;
      }
    } else if (lastMove === dir.DOWN) {
      if ((space[x + 1] || [])[y]) {
        lastMove = dir.RIGHT;
        x++;
        space[x][y] = 2;

        if (maxX === undefined || x > maxX) {
          maxX = x;
        }

        moved = true;
      } else {
        lastMove = dir.LEFT;
      }
    } else if (lastMove === dir.LEFT) {
      if ((space[x] || [])[y + 1]) {
        lastMove = dir.DOWN;
        y++;
        space[x][y] = 2;

        if (maxY === undefined || y > maxY) {
          maxY = y;
        }

        moved = true;
      } else {
        lastMove = dir.UP;
      }
    } else if (lastMove === dir.UP) {
      if ((space[x - 1] || [])[y]) {
        lastMove = dir.LEFT;
        x--;
        space[x][y] = 2;

        if (minX === undefined || x < minX) {
          minX = x;
        }

        moved = true;
      } else {
        lastMove = dir.RIGHT;
      }
    }
  }

  return [minX, minY, maxX, maxY];
};
