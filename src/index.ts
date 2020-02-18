import fetch from '@brillout/fetch'

function isBrowser() {
    return typeof window !== 'undefined'
}

const getRequest = () => {
    if (isBrowser()) {
        return window.fetch.bind(window)
    } else {
        return fetch
    }
}

// polyfil for window.performance.now
// @ts-ignore
const performance = global.performance || {}
const performanceNow =
    performance.now ||
    performance.mozNow ||
    performance.msNow ||
    performance.oNow ||
    performance.webkitNow ||
    function() {
        return new Date().getTime()
    }

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
const hrtime = previousTimestamp => {
    let clocktime = performanceNow.call(performance) * 1e-3
    let seconds = Math.floor(clocktime)
    let nanoseconds = Math.floor((clocktime % 1) * 1e9)
    if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0]
        nanoseconds = nanoseconds - previousTimestamp[1]
        if (nanoseconds < 0) {
            seconds--
            nanoseconds += 1e9
        }
    }
    return [seconds, nanoseconds]
}

const time = process.hrtime || hrtime

const now = unit => {
    console.log('process', process)
    debugger

    // @ts-ignore
    const hrTime = time()

    switch (unit) {
        case 'milli':
            return hrTime[0] * 1000 + hrTime[1] / 1000000

        case 'micro':
            return hrTime[0] * 1000000 + hrTime[1] / 1000

        case 'nano':
            return hrTime[0] * 1000000000 + hrTime[1]

        default:
            return now('nano')
    }
}

export default class Loggr {
    private readonly ignoreSSLError: boolean
    private readonly debugMode: boolean
    private readonly host: string
    private readonly apiKey: string
    private readonly app: string
    private readonly domain: string

    constructor(options) {
        console.log('options', options)
        this.ignoreSSLError = options.ignoreSSLError ? options.ignoreSSLError : false
        this.debugMode = options.debugMode ? options.debugMode : false
        this.host = options.host
        this.apiKey = options.apiKey
        this.app = options.app
        this.domain = this.host.includes('localhost:') ? `http://${this.host}` : `https://${this.host}`
    }

    log = (level, line) => {
        const request = getRequest()

        if (this.debugMode) {
            console.log('LOGGR-JS: isBrowser', {
                ignoreSSLError: this.ignoreSSLError,
                isBrowser: isBrowser(),
                host: this.host,
                domain: this.domain,
                url: `${this.domain}/api/log`,
                fetch: request ? 'Fetch Available' : 'No Request Available',
                apiKey: this.apiKey
            })
        }

        const meta = {
            at: now('nano'), // Date.now(),
            app: this.app,
            level: level || 'INFO'
        }

        request(`${this.domain}/api/log`, {
            rejectUnauthorized: !this.ignoreSSLError,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'loggr-api-key': this.apiKey
            },
            body: JSON.stringify({
                meta,
                ...line
            })
        })
            .then(res => res.json())
            .then(json => {
                if (this.debugMode) {
                    console.log('LOGGR-JS: Successful to log', json)
                }
            })
            .catch(error => console.log('Loggr: Failed to log', error))
    }

    critical = line => {
        this.log('CRITICAL', line)
    }

    debug = line => {
        this.log('DEBUG', line)
    }

    emergency = line => {
        this.log('EMERGENCY', line)
    }

    error = line => {
        this.log('ERROR', line)
    }

    fatal = line => {
        this.log('FATAL', line)
    }

    info = line => {
        this.log('INFO', line)
    }

    severe = line => {
        this.log('SEVERE', line)
    }

    success = line => {
        this.log('SUCCESS', line)
    }

    trace = line => {
        this.log('TRACE', line)
    }

    warn = line => {
        this.log('WARN', line)
    }
}
