import path from 'path';

export default {
    entry: './workers/urlRotationWorker.js',
    output: {
        filename: 'urlRotationWorker.js',
        path: path.resolve('worker-dist'),
    },
    // other configurations
};
