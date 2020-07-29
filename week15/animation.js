export class Timeline {
    constructor() {
        this.animation = []
    }
    tick() {
        let t = Date.now() - this.startTime
        for (let animation of this.animation) {
            if (t > animation.duration + animation.delay) continue

            let {
                object,
                property,
                template,
                start,
                end,
                duration,
                timingFunction
            } = animation

            let progression = timingFunction((t - delay) / duration)
            let value = start + progression * (end - start)

            object[property] = template(value)
        }
        requestAnimationFrame(() => this.thick())
    }

    start() {
        this.startTime = Date.now()
        this.tick()
    }

    add(animation) {
        this.animation.push(animation)
    }
}

export class Animation {
    constructor(object, property, template, start, end, duration, delay, timingFunction) {
        this.object = object
        this.property = property
        this.template = template
        this.start = start
        this.end = end
        this.duration = duration
        this.delay = delay
        this.timingFunction = timingFunction
    }
}