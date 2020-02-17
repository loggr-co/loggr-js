export default class Loggr {
    private readonly ignoreSSLError;
    private readonly debugMode;
    private readonly host;
    private readonly apiKey;
    private readonly app;
    private readonly domain;
    constructor(options: any);
    log: (level: any, line: any) => void;
    critical: (line: any) => void;
    debug: (line: any) => void;
    emergency: (line: any) => void;
    error: (line: any) => void;
    fatal: (line: any) => void;
    info: (line: any) => void;
    severe: (line: any) => void;
    success: (line: any) => void;
    trace: (line: any) => void;
    warn: (line: any) => void;
}
