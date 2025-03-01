declare module 'critters' {
  import { Plugin } from 'rollup';
  interface CrittersOptions {
    inline?: boolean;
    preload?: 'swap' | 'auto' | 'none';
    compress?: boolean;
    pruneSource?: boolean;
    logLevel?: 'info' | 'warn' | 'error' | 'silent';
  }
  function critters(options?: CrittersOptions): Plugin;
  export = critters;
}
