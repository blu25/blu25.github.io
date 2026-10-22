// The hero doodle's pupils follow the pointer
const doodle = document.querySelector(".doodle");
if (doodle && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
	addEventListener("pointermove", e => {
		const r = doodle.getBoundingClientRect();
		const dx = e.clientX - (r.left + r.width * 0.47);
		const dy = e.clientY - (r.top + r.height * 0.48);
		const dist = Math.hypot(dx, dy) || 1;
		// Pupils drift up to ~1.2% of the doodle's width, less when the pointer is close
		const reach = Math.min(1, dist / 300) * r.width * 0.012;
		doodle.style.setProperty("--ex", `${dx / dist * reach}px`);
		doodle.style.setProperty("--ey", `${dy / dist * reach}px`);
	});
}
