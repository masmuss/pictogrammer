export function rootInDarkMode() {
	const root = document.documentElement;
	return (
		root.classList.contains("dark") ||
		root.getAttribute("data-theme") === "dark"
	);
}
