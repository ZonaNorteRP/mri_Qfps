/**
 * A simple wrapper around invokeNative that checks if we are in a browser environment.
 */
export const isEnvBrowser = (): boolean => !(window as any).invokeNative;