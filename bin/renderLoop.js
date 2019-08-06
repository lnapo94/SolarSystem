class RenderLoop {
    constructor(callback) {
        let self = this;
        this.msLastFrame = null;
        this.callback = callback;
        this.isActive = false;
        this.fps = 0;

        this.run = function () {
            let msCurrent = performance.now();
            let deltaTime = (msCurrent - self.msLastFrame) / 1000.0;

            self.fps = Math.floor(1/deltaTime);
            self.msLastFrame = msCurrent;

            self.callback(deltaTime);

            if(self.isActive)
                window.requestAnimationFrame(self.run);
        }
    }

    start() {
        this.isActive = true;
        this.msLastFrame = performance.now();
        window.requestAnimationFrame(this.run);
        return this;
    }

    stop() {
        this.isActive = false;
    }
}