import { expose } from 'comlink';

class Worker {
  async doWork() {
    return 'Hello from worker';
  }
}

expose(Worker);

export default {};
