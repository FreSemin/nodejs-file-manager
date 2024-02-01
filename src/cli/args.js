import { parseArgs } from '../utils/args.util.js';

export function getProcessArgument(argName) {
  const argsMap = parseArgs();

  return argsMap.get(argName);
}