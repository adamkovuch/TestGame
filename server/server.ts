global['server_port'] = process.env.PORT || '8080';

import app from './app';
import * as cluster from 'cluster';

const clustersEnabled = (process.env.CLUSTERS==='false')?false:true;

if(!clustersEnabled) {
    console.warn('App staring without clusters');
}

if(cluster.isMaster && clustersEnabled) {
  // Master process: fork our child processes.
  const numWorkers = process.env.WEB_CONCURRENCY || 1;
  for (var i = 0; i < numWorkers; i += 1) {
    console.log('** Booting new worker **');
    cluster.fork();
  }

  // Respawn any child processes that die
  cluster.on('exit', function(worker, code, signal) {
    console.log('process %s died (%s). restarting...', worker.id, signal || code);
    cluster.fork();
  });

} else {
    app.start();
}
