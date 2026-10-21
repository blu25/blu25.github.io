// Fade-out fallback for browsers without cross-document view transitions
if (!("onpagereveal" in window)) {
	addEventListener("click", e => {
		const a = e.target.closest("a");
		if (!a || a.target || a.origin !== location.origin || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
			|| matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		e.preventDefault();
		document.documentElement.classList.add("leaving");
		// Navigate once every fade-out has finished
		Promise.allSettled(document.getAnimations().map(anim => anim.finished)).then(() => location.href = a.href);
	});
	// Undo the fade if the page comes back from the back/forward cache
	addEventListener("pageshow", () => document.documentElement.classList.remove("leaving"));
}
