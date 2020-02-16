export default class Loggr {
    private readonly host;
    private readonly apiKey;
    private readonly app;
    private readonly mode;
    constructor(options: any);
    log: (level: any, line: any) => void;
    info: (line: any) => void;
    warn: (line: any) => void;
    debug: (line: any) => void;
    error: (line: any) => void;
    success: (line: any) => void;
    critical: (line: any) => void;
}
