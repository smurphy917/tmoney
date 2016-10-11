function controlPointsFromPoints(K) {
    var p1 = new Array(), p2 = new Array(), n = K.length - 1;
    /*rhs vector*/
    var a = new Array(), b = new Array(), c = new Array(), r = new Array();
    /*left most segment*/
    a[0] = 0;
    b[0] = 2;
    c[0] = 1;
    r[0] = K[0] + 2 * K[1];
    /*internal segments*/
    for (var i = 1; i < n - 1; i++) {
        a[i] = 1;
        b[i] = 4;
        c[i] = 1;
        r[i] = 4 * K[i] + 2 * K[i + 1];
    }
    /*right segment*/
    a[n - 1] = 2;
    b[n - 1] = 7;
    c[n - 1] = 0;
    r[n - 1] = 8 * K[n - 1] + K[n];
    /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
    for (var i = 1; i < n; i++) {
        var m = a[i] / b[i - 1];
        b[i] = b[i] - m * c[i - 1];
        r[i] = r[i] - m * r[i - 1];
    }
    p1[n - 1] = r[n - 1] / b[n - 1];
    for (var i = n - 2; i >= 0; --i)
        p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];
    /*we have p1, now compute p2*/
    for (var i = 0; i < n - 1; i++)
        p2[i] = 2 * K[i + 1] - p1[i + 1];
    p2[n - 1] = 0.5 * (K[n] + p1[n - 1]);
    var pts = new Array();
    for (var i = 0; i < p1.length; i++) {
        pts[i] = { 'p1': p1[i], 'p2': p2[i] };
    }
    return pts;
}
function ControlPoints(rocks) {
    rocks[0].baseHeight = rocks[0].baseHeight || 0;
    for (var i = 1; i < rocks.length; i++) {
        rocks[i].baseHeight = rocks[i - 1].baseHeight + rocks[i - 1].delta;
    }
    var Ky = rocks.map(function (r) { return r.baseHeight; });
    var ts = 0;
    var Kx = rocks.map(function (r) {
        ts += r.timeSpan;
        return ts;
    });
    Ky[rocks.length] = rocks[rocks.length - 1].baseHeight + rocks[rocks.length - 1].delta;
    Kx[rocks.length] = rocks[rocks.length - 1].timeSpan + ts;
    var py = controlPointsFromPoints(Ky);
    var px = controlPointsFromPoints(Kx);
    var pts = new Array();
    for (var i = 0; i < py.length; i++) {
        pts[i] = { p1: [px[i].p1, py[i].p1], p2: [px[i].p2, py[i].p2] };
    }
    return pts;
}
exports.ControlPoints = ControlPoints;
//# sourceMappingURL=curve.function.js.map