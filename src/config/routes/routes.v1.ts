import {Router} from 'express';
import {cacheLruFast} from '../../factories/cache';
import {AdminController} from '../../controllers/admin';
import {MeasureController} from '../../controllers/measure';
import {QualityController} from '../../controllers/quality';

export const routes = async (router: Router) => {

    // get status
    //      based on Who's Who advice => poll or update
    router.get('/status', cacheLruFast, AdminController.getStatus);

    // wind?date=...&lat=...&lng=...
    // {azimuthInDegrees: 12, speedInMetersPerSec: 5}
    router.get('/wind', MeasureController.getWind);
    router.post('/wind', MeasureController.postWind);
    // {points: latLng[]}
    router.get('/wind/map', MeasureController.getWindMap);

    // water?date=...&lat=...&lng=...
    // {mm: 0.2}
    router.get('/water', MeasureController.getWater);
    router.post('/water', MeasureController.postWater);

    // date
    // cartesianRainHistories: CartesianRainHistory[],
    // radarsLatLng: LatLng[],
    // gaugeNodes: GaugeNode[],
    // provider
    // freqInMin
    // optionalAzimuthToleranceInDegrees: number,  (0: no, 90: 180 degrees of tolerance)
    // {rainComputationQuality: }
    router.post('/quality', QualityController.postQuality);

    router.post('/poll', AdminController.postPoll);

    router.post('/update', AdminController.postUpdate);

    return router;

};
