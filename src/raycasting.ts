

export class Raycaster {

    // ------------------------------------------------------------- #
    // IMPLEMENTATION OF: https://github.com/ncase/sight-and-light   #
    //-------------------------------------------------------------- #


    ctx: CanvasRenderingContext2D;
    segments: any[];

    constructor(ctx: CanvasRenderingContext2D, segments: any[]) {
        this.ctx = ctx;
        this.segments = segments;
    }

    rayCasting(x: number, y: number) {
        this.ctx.globalAlpha = 0.2;
        var fuzzyRadius = 20;
        var polygons = [this.getSightPolygon(x, y)];
        for (var angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 10) {
            var dx = Math.cos(angle) * fuzzyRadius;
            var dy = Math.sin(angle) * fuzzyRadius;
            polygons.push(this.getSightPolygon(x + dx, y + dy));
        };
        // DRAW AS A GIANT POLYGON
        for (var i = 1; i < polygons.length; i++) {
            this.drawPolygon(polygons[i], this.ctx, "rgba(255,255,255,0.2)");
        }
        this.drawPolygon(polygons[0], this.ctx, "");
        this.ctx.globalAlpha = 1;
    }
    drawPolygon(polygon: string | any[], ctx: CanvasRenderingContext2D, fillStyle: string) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(polygon[0].x, polygon[0].y);
        for (var i = 1; i < polygon.length; i++) {
            var intersect = polygon[i];
            ctx.lineTo(intersect.x, intersect.y);
        }
        ctx.fill();
    }

    // Find intersection of RAY & SEGMENT
    getIntersection(ray: { a: any; b: any; }, segment: { a: any; b: any; }) {
        // RAY in parametric: Point + Delta*T1
        var r_px = ray.a.x;
        var r_py = ray.a.y;
        var r_dx = ray.b.x - ray.a.x;
        var r_dy = ray.b.y - ray.a.y;
        // SEGMENT in parametric: Point + Delta*T2
        var s_px = segment.a.x;
        var s_py = segment.a.y;
        var s_dx = segment.b.x - segment.a.x;
        var s_dy = segment.b.y - segment.a.y;
        // Are they parallel? If so, no intersect
        var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
        if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
            // Unit vectors are the same.
            return null;
        }
        // SOLVE FOR T1 & T2
        var T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        var T1 = (s_px + s_dx * T2 - r_px) / r_dx;
        // Must be within parametic whatevers for RAY/SEGMENT
        if (T1 < 0) return null;
        if (T2 < 0 || T2 > 1) return null;
        // Return the POINT OF INTERSECTION
        return {
            x: r_px + r_dx * T1,
            y: r_py + r_dy * T1,
            param: T1,
            angle: 0
        };
    }

    // create polygon from segment in sight
    getSightPolygon(sightX: number, sightY: number) {

        // get all the points 
        var points = ((segments) => {
            const a: { x: number; y: number; angle: number; }[] = [];
            segments.forEach((seg) => {
                a.push(seg.a, seg.b);
            });
            return a;
        })(this.segments);

        // keep only 1 copy
        var uniquePoints = ((points) => {
            var set: any = {};
            return points.filter((p) => {
                var key = p.x + "," + p.y;
                if (key in set) {
                    return false;
                } else {
                    set[key] = true;
                    return true;
                }
            });
        })(points);

        // Get all angles
        var uniqueAngles = [];
        for (var j = 0; j < uniquePoints.length; j++) {
            var uniquePoint = uniquePoints[j];
            var angle = Math.atan2(uniquePoint.y - sightY, uniquePoint.x - sightX);
            uniquePoint.angle = angle;
            uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
        }


        // RAYS IN ALL DIRECTIONS
        var intersects = [];
        for (var j = 0; j < uniqueAngles.length; j++) {
            var angle = uniqueAngles[j];
            // Calculate dx & dy from angle
            var dx = Math.cos(angle);
            var dy = Math.sin(angle);
            // Ray from center of screen to mouse
            var ray = {
                a: {
                    x: sightX,
                    y: sightY
                },
                b: {
                    x: sightX + dx,
                    y: sightY + dy
                }
            };
            // Find CLOSEST intersection
            var closestIntersect = null;
            for (var i = 0; i < this.segments.length; i++) {
                var intersect = this.getIntersection(ray, this.segments[i]);
                if (!intersect) continue;
                if (!closestIntersect || intersect.param < closestIntersect.param) {
                    closestIntersect = intersect;
                }
            }
            // Intersect angle
            if (!closestIntersect) continue;
            closestIntersect.angle = angle;
            // Add to list of intersects
            intersects.push(closestIntersect);
        }
        // Sort intersects by angle
        intersects = intersects.sort(function (a, b) {
            return a.angle - b.angle;
        });
        // Polygon is intersects, in order of angle
        return intersects;
    }

}
