// eslint-disable-next-line n/prefer-node-protocol
import type { Buffer as BufferType } from "node:buffer";

declare global {
    // eslint-disable-next-line no-var
    var Buffer: typeof BufferType;
}
