export class Timeline {
    constructor() {
        this.animation = []
        this.reuestID = null
        this.tick = () => {
            let t = Date.now() - this.startTime
            let animation = this.animations.filter(animation => !animation.finished)
            for (let animation of this.animation) {
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

                if (t > animation.duration + animation.delay) {
                    progression = 1
                    animation.finished = true
                }

                let value = start + progression * (end - start)

                object[property] = template(value)
            }

            if (animations.length) {
                this.reuestID = requestAnimationFrame(this.thick)
            }
        }
    }

    pause() {
        this.pauseTime = Date.now()
        if (this.reuestID !== null) {
            cancelAnimationFrame(this.reuestID)
        }
    }

    resume() {
        this.startTime += Date.now() - this.pauseTime
        this.tick()
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