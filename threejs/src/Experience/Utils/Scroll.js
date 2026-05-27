
export default class Scroll {
    constructor() {

        this.scrollY = 0;
        this.lastScrollY = 0;

        this.scrollProgress = 0;

        this.velocity = 0;
        this.direction = 0; // -1 up, 1 down

        this.smoothScroll = 0;

        this.damping = 0.08;

        this.maxScroll = this.getMaxScroll();

        this.onScroll = this.onScroll.bind(this);

        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('resize', () => {
            this.maxScroll = this.getMaxScroll();
        });
    }

    getMaxScroll() {
        return document.body.scrollHeight - window.innerHeight;
    }

    onScroll() {

        this.scrollY = window.scrollY || 0;

        // progress 0 → 1
        this.scrollProgress = this.maxScroll > 0
            ? this.scrollY / this.maxScroll
            : 0;

        // direction
        const delta = this.scrollY - this.lastScrollY;

        this.direction = Math.sign(delta);

        // velocity (smoothed)
        this.velocity = delta * 0.1;

        this.lastScrollY = this.scrollY;
    }

    update() {

        this.scrollY = window.scrollY || 0;

        this.maxScroll = this.getMaxScroll();

        this.scrollProgress = this.maxScroll > 0
            ? this.scrollY / this.maxScroll
            : 0;

        const delta = this.scrollY - this.lastScrollY;

        this.direction = Math.sign(delta);
        this.velocity = delta * 0.1;

        this.lastScrollY = this.scrollY;

        // smooth interpolation (MORA svaki frame)
        this.smoothScroll +=
            (this.scrollProgress - this.smoothScroll) *
            this.damping;
    }

    destroy() {
        window.removeEventListener('scroll', this.onScroll);
    }
}