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
    private readonly host: string
    private readonly apiKey: string
    private readonly app: string
    private readonly mode: string

    constructor(options) {
        let mode = options.mode || 'production'
        this.host = options.host
        this.apiKey = options.apiKey
        this.app = options.app
        this.mode = mode.toUpperCase()
    }

    log = (level, line) => {
        const request = getRequest()

        console.log('LOGGR-JS: isBrowser', isBrowser(), `${this.host}/api/log`, request ? 'Fetch Available' : 'No Request Available')

        const meta = {
            at: Date.now(),
            app: this.app,
            level: level || 'INFO'
        }

        request(`${this.host}/api/log`, {
            rejectUnauthorized: this.mode === 'PRODUCTION' ? true : false,
            mode: 'no-cors',
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
            .then(json => console.log('LOGGR-JS: Successful to log', json))
            .catch(error => console.log('LOGGR-JS: Failed to log', error))
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
