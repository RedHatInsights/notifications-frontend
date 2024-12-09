import { Server, ServerStatus } from '../Server';

export const toServer = (): Server => {
  return {
    status: ServerStatus.RUNNING,
  };
};
