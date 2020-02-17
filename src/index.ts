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

export default class Loggr {
    private readonly ignoreSSLError: boolean
    private readonly debugMode: boolean
    private readonly host: string
    private readonly apiKey: string
    private readonly app: string
    private readonly domain: string

    constructor(options) {
        this.ignoreSSLError = options.ignoreSSLError ? options.ignoreSSLError : false
        this.debugMode = options.debugMode ? options.debugMode : false
        this.host = options.host
        this.apiKey = options.apiKey
        this.app = options.app
        this.domain = this.host.includes('localhost:') ? `http://${this.host}` : `https://${this.host}`
    }

    log = (level, line) => {
        const request = getRequest()

        console.log('LOGGR-JS: isBrowser', {
            isBrowser: isBrowser(),
            url: `${this.domain}/api/log`,
            fetch: request ? 'Fetch Available' : 'No Request Available',
            apiKey: this.apiKey
        })

        const meta = {
            at: Date.now(),
            app: this.app,
            level: level || 'INFO'
        }

        request(`${this.domain}/api/log`, {
            rejectUnauthorized: this.ignoreSSLError,
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

    info = line => {
        this.log('INFO', line)
    }

    warn = line => {
        this.log('WARN', line)
    }

    debug = line => {
        this.log('DEBUG', line)
    }

    error = line => {
        this.log('ERROR', line)
    }

    success = line => {
        this.log('SUCCESS', line)
    }

    critical = line => {
        this.log('CRITICAL', line)
    }
}
