class GithubCard extends HTMLElement {
	static observedAttributes = ["repo", "user"];

	get _name() {
		return this.getAttribute("repo") || this.getAttribute("user") || "";
	}

	get _isRepo() {
		return this.hasAttribute("repo");
	}

	connectedCallback() {
		const name = this._name;
		if (!name) return;

		const fallback = this.innerHTML;
		const realUrl = `https://github.com/${name}`;
		const isRepo = this._isRepo;

		this.classList.add("github-card", "gh-loading");

		const [owner, repoName] = name.split("/");
		const title = isRepo ? `${owner}/${repoName}` : owner;

		const repoChips = `
			<span class="gh-stars">00K</span>
			<span class="gh-forks">00K</span>
			<span class="gh-license">MIT</span>
			<span class="gh-language"></span>`;

		const userChips = `
			<span class="gh-followers">00K</span>
			<span class="gh-repositories">00K</span>
			<span class="gh-region"></span>`;

		this.innerHTML = `
			<div class="gh-title title">
				<span class="gh-avatar"></span>
				<a class="gh-text not-prose cactus-link" href="${realUrl}">${title}</a>
				<span class="gh-icon"></span>
			</div>
			<div class="gh-description">Loading repository information...</div>
			<div class="gh-chips">${isRepo ? repoChips : userChips}</div>`;

		const endpoint = isRepo
			? `https://api.github.com/repos/${name}`
			: `https://api.github.com/users/${name}`;

		fetch(endpoint, { referrerPolicy: "no-referrer" })
			.then((response) => {
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				return response.json();
			})
			.then((data) => {
				this.classList.remove("gh-loading");

				if (isRepo) {
					if (data.description) {
						const descEl = this.querySelector(".gh-description");
						if (descEl)
							descEl.textContent = data.description.replace(
								/:[a-zA-Z0-9_]+:/g,
								""
							);
					} else {
						const descEl = this.querySelector(".gh-description");
						if (descEl) descEl.style.display = "none";
					}
					if (data.language) {
						const langEl = this.querySelector(".gh-language");
						if (langEl) langEl.textContent = data.language;
					}
					const starsEl = this.querySelector(".gh-stars");
					if (starsEl)
						starsEl.textContent = formatCompact(data.stargazers_count);
					const forksEl = this.querySelector(".gh-forks");
					if (forksEl) forksEl.textContent = formatCompact(data.forks);
					if (data.license?.spdx_id) {
						const licenseEl = this.querySelector(".gh-license");
						if (licenseEl) licenseEl.textContent = data.license.spdx_id;
					} else {
						const licenseEl = this.querySelector(".gh-license");
						if (licenseEl) licenseEl.style.display = "none";
					}
					const avatarEl = this.querySelector(".gh-avatar");
					if (avatarEl)
						avatarEl.style.backgroundImage = `url(${data.owner.avatar_url})`;
				} else {
					const avatarEl = this.querySelector(".gh-avatar");
					if (avatarEl)
						avatarEl.style.backgroundImage = `url(${data.avatar_url})`;
					const followersEl = this.querySelector(".gh-followers");
					if (followersEl)
						followersEl.textContent = formatCompact(data.followers);
					const reposEl = this.querySelector(".gh-repositories");
					if (reposEl) reposEl.textContent = formatCompact(data.public_repos);
					if (data.location) {
						const regionEl = this.querySelector(".gh-region");
						if (regionEl) regionEl.textContent = data.location;
					}
				}
			})
			.catch((err) => {
				this.classList.add("gh-error");
				this.innerHTML = fallback;
				console.warn(`[GITHUB-CARD] Error loading ${name}`, err);
			});
	}
}

function formatCompact(num) {
	if (num == null) return "0";
	return Intl.NumberFormat(undefined, {
		notation: "compact",
		maximumFractionDigits: 1
	})
		.format(num)
		.replaceAll("\u202f", "");
}

if (!customElements.get("github-card")) {
	customElements.define("github-card", GithubCard);
}
