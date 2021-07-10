/**
 * Object holding bounds as a polygon and handling collision logic.
 */
class Bounds {
  #polygons;

  constructor(polygons) {
    if (polygons) {
      this.#polygons = polygons.filter(arr => arr.length > 1);
    }
  }

  /**
   * Finds nearest collision point with a bound.  If none exists, returns the end point
   * @param {Integer} startX
   * @param {Integer} startY
   * @param {Integer} endX
   * @param {Integer} endY
   * @returns 2 element array representing [x, y] coordinate of collision
   */
  findNearestCollisionPoint(startX, startY, endX, endY) {
    if (this.#polygons) {
      const collisionPoints = this.#polygons
        .map(arr => this.#findIntersectionsWithPolygon(startX, startY, endX, endY, arr))
        .flat(1);
      if (collisionPoints.length === 0) {
        return [endX, endY];
      }
      collisionPoints.sort(
        (a, b) =>
          this.#distanceSquared(a[0], a[1], startX, startY) -
          this.#distanceSquared(b[0], b[1], startX, startY)
      );
      const [resX, resY] = collisionPoints[0];
      return [
        startX < resX ? Math.floor(resX) - 1 : Math.ceil(resX) + 1,
        startY < resY ? Math.floor(resY) - 1 : Math.ceil(resY) + 1
      ];
    }
    return [endX, endY];
  }

  #distanceSquared(x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  }

  #findIntersectionsWithPolygon(startX, startY, endX, endY, polygon) {
    let collisions = [];
    for (let i = 0; i < polygon.length - 1; i++) {
      const polyPoint1 = polygon[i];
      const polyPoint2 = polygon[i + 1];
      const intersectionsResult = this.#checkLineIntersection(
        startX,
        startY,
        endX,
        endY,
        polyPoint1[0],
        polyPoint1[1],
        polyPoint2[0],
        polyPoint2[1]
      );
      if (intersectionsResult.onLine1 && intersectionsResult.onLine2) {
        collisions.push([intersectionsResult.x, intersectionsResult.y]);
      }
    }
    const firstPoint = polygon[0];
    const lastPoint = polygon[polygon.length - 1];
    const intersectionsResult = this.#checkLineIntersection(
      startX,
      startY,
      endX,
      endY,
      firstPoint[0],
      firstPoint[1],
      lastPoint[0],
      lastPoint[1]
    );
    if (intersectionsResult.onLine1 && intersectionsResult.onLine2) {
      collisions.push([intersectionsResult.x, intersectionsResult.y]);
    }
    return collisions;
  }

  #checkLineIntersection(
    line1StartX,
    line1StartY,
    line1EndX,
    line1EndY,
    line2StartX,
    line2StartY,
    line2EndX,
    line2EndY
  ) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    let denominator,
      a,
      b,
      numerator1,
      numerator2,
      result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
      };
    denominator =
      (line2EndY - line2StartY) * (line1EndX - line1StartX) -
      (line2EndX - line2StartX) * (line1EndY - line1StartY);
    if (denominator === 0) {
      return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = (line2EndX - line2StartX) * a - (line2EndY - line2StartY) * b;
    numerator2 = (line1EndX - line1StartX) * a - (line1EndY - line1StartY) * b;
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + a * (line1EndX - line1StartX);
    result.y = line1StartY + a * (line1EndY - line1StartY);
    /*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
      result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
      result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
  }
}

module.exports = {
  Bounds
};
