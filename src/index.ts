import superagent from 'superagent'

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

        superagent
            .post(`${this.host}/api/log`)
            .send({
                meta,
                ...line
            })
            .set('Content-Type', 'application/json')
            .then()
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
