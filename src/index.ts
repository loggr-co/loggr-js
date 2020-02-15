import fetch from '@brillout/fetch'

function isBrowser() {
    return typeof window !== 'undefined'
}

export default class Loggr {
    private readonly host: string
    private readonly apiKey: string
    private readonly app: string

    constructor(options) {
        this.host = options.host
        this.apiKey = options.apiKey
        this.app = options.app
    }

    log = (level, line) => {
        const meta = {
            at: Date.now(),
            app: this.app,
            level: level || 'INFO'
        }

        console.log('isBrowser', isBrowser(), `${this.host}/api/log`, fetch)

        fetch(`${this.host}/api/log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meta,
                ...line
            })
        })
            .then(res => res.json())
            .then(json => console.log('Loggr: Successful to log', json))
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
