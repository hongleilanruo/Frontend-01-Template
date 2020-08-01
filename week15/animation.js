export class Timeline {
    constructor() {
        this.animation = []
        this.reuestID = null
        this.state = 'inited'
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

                let progression = timingFunction((t - delay - startTime) / duration)

                if (t > duration + delay + startTime) {
                    progression = 1
                    animation.finished = true
                }

                let value = animation.valueFromProgression(progression)

                object[property] = template(value)
            }

            if (animations.length) {
                this.reuestID = requestAnimationFrame(this.thick)
            }
        }
    }

    pause() {
        if (this.state !== 'playing') return
        this.state = 'paused'
        this.pauseTime = Date.now()
        if (this.reuestID !== null) {
            cancelAnimationFrame(this.reuestID)
        }
    }

    resume() {
        if (this.state !== 'paused') return
        this.state = 'playing'
        this.startTime += Date.now() - this.pauseTime
        this.tick()
    }

    start() {
        if (this.state !== 'inited') return
        this.state = 'playing'
        this.startTime = Date.now()
        this.tick()
    }

    restart() {
        if (this.state === 'playing') {
            this.pause()
        }
        this.animation = []
        this.reuestID = null
        this.state = 'playing'
        this.startTime = Date.now()
        this.pauseTime = null
        this.tick();
    }

    add(animation, startTime) {
        this.animation.push(animation)
        animation.finished = false
        if (this.state === 'playing') {
            animation.startTime = startTime !== void 0 ? startTime : Date.now() - this.startTime
        } else {
            animation.startTime = startTime !== void 0 ? startTime : 0
        }
    }
}

export class Animation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object
        this.property = property
        this.template = template || (v => `rgba(${v.r},${v.g},${v.b},${v.a})`)
        this.start = start
        this.end = end
        this.duration = duration
        this.delay = delay
        this.timingFunction = timingFunction
    }
    valueFromProgression(progression) {
        return this.start + progression * (this.end - this.start)
    }
}

export class ColorAnimation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object
        this.property = property
        this.template = template || (v => `rgba(${v.r},${v.g},${v.b},${v.a})`)
        this.start = start
        this.end = end
        this.duration = duration
        this.delay = delay
        this.timingFunction = timingFunction
    }
    valueFromProgression(progression) {
        return {
            r: this.start.r + progression * (this.end.r - this.start.r),
            g: this.start.g + progression * (this.end.g - this.start.g),
            b: this.start.b + progression * (this.end.b - this.start.b),
            a: this.start.a + progression * (this.end.a - this.start.a)
        }
    }
}