export type Activity = {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
};

export type ApiResponse = {
	total: Record<string, number>;
	contributions: Activity[];
};

type CacheEntry = {
	data: Activity[];
	fetchedAt: number;
};

type FetchGitHubContributionsOptions = {
	forceRefresh?: boolean;
	enableLogging?: boolean;
};

const GITHUB_CACHE_TTL_MS = 60 * 60 * 1000;
const GITHUB_STALE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const contributionsCache = new Map<string, CacheEntry>();
const GITHUB_API_BASE_URL = "https://github-contributions-api.jogruber.de/v4/";

const WEEK_START_SUNDAY = 0;
const WEEK_START_MONDAY = 1;

function getCacheKey(username: string, year: number | "last"): string {
	return `${username}:${year}`;
}

function getCachedEntry(cacheKey: string): CacheEntry | undefined {
	const entry = contributionsCache.get(cacheKey);
	if (!entry) return undefined;

	const age = Date.now() - entry.fetchedAt;
	if (age > GITHUB_STALE_CACHE_TTL_MS) {
		contributionsCache.delete(cacheKey);
		return undefined;
	}

	return entry;
}

function logCacheEvent(enableLogging: boolean, message: string): void {
	if (!enableLogging) return;
	console.info(`[github-calendar] ${message}`);
}

const GITHUB_FETCH_TIMEOUT_MS = 10_000;

async function fetchFromGitHubApi(
	username: string,
	year: number | "last",
	options: { forceRefresh: boolean } = { forceRefresh: false }
): Promise<Activity[]> {
	const headers: HeadersInit = {};
	if (options.forceRefresh) {
		headers["Cache-Control"] = "no-cache";
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(
		() => controller.abort(),
		GITHUB_FETCH_TIMEOUT_MS
	);

	let response: Response;
	try {
		response = await fetch(
			`${GITHUB_API_BASE_URL}${username}?y=${String(year)}`,
			{ headers, signal: controller.signal }
		);
	} finally {
		clearTimeout(timeoutId);
	}

	if (!response.ok) {
		throw new Error(
			`Failed to fetch GitHub contributions: ${response.statusText}`
		);
	}

	const data = (await response.json()) as ApiResponse;
	return data.contributions || [];
}

export async function fetchGitHubContributions(
	username: string,
	year: number | "last" = "last",
	options: FetchGitHubContributionsOptions = {}
): Promise<Activity[]> {
	const forceRefresh = options.forceRefresh ?? false;
	const enableLogging = options.enableLogging ?? false;
	const queryParams = new URLSearchParams({
		username,
		year: String(year)
	});

	if (forceRefresh) {
		queryParams.set("force", "1");
	}

	if (enableLogging) {
		queryParams.set("log", "1");
	}

	const cacheKey = getCacheKey(username, year);
	const cachedEntry = getCachedEntry(cacheKey);

	if (
		cachedEntry &&
		Date.now() - cachedEntry.fetchedAt < GITHUB_CACHE_TTL_MS &&
		!forceRefresh
	) {
		logCacheEvent(enableLogging, `cache hit for ${cacheKey}`);
		return cachedEntry.data;
	}

	if (forceRefresh) {
		logCacheEvent(enableLogging, `force refresh requested for ${cacheKey}`);
	} else {
		logCacheEvent(enableLogging, `cache miss for ${cacheKey}`);
	}

	try {
		const contributions = await fetchFromGitHubApi(username, year, {
			forceRefresh
		});
		contributionsCache.set(cacheKey, {
			data: contributions,
			fetchedAt: Date.now()
		});
		logCacheEvent(
			enableLogging,
			`cache updated for ${cacheKey} with ${contributions.length} entries`
		);
		return contributions;
	} catch (error) {
		console.error("Error fetching GitHub contributions:", error);

		if (cachedEntry) {
			console.warn("Using stale GitHub contribution cache after fetch failure");
			logCacheEvent(enableLogging, `serving stale cache for ${cacheKey}`);
			return cachedEntry.data;
		}

		logCacheEvent(enableLogging, `no cache fallback available for ${cacheKey}`);

		return [];
	}
}

function buildActivityMap(activities: Activity[]): Map<string, Activity> {
	return new Map(activities.map((a) => [a.date, a]));
}

function getWeekRange(
	firstDate: Date,
	lastDate: Date,
	weekStart: number
): { start: Date; end: Date } {
	const start = new Date(firstDate);
	const dayDiff = (start.getDay() - weekStart + 7) % 7;
	start.setDate(start.getDate() - dayDiff);

	const end = new Date(lastDate);
	const endDayDiff = (6 - ((end.getDay() - weekStart + 7) % 7)) % 7;
	end.setDate(end.getDate() + endDayDiff);

	return { start, end };
}

function buildWeekGrid(
	startDate: Date,
	endDate: Date,
	activityMap: Map<string, Activity>
): Array<Array<Activity | undefined>> {
	const weeks: Array<Array<Activity | undefined>> = [];
	const currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		const week: Array<Activity | undefined> = [];

		for (let i = 0; i < 7; i++) {
			const dateStr = currentDate.toISOString().split("T")[0] || "";
			week.push(activityMap.get(dateStr));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		weeks.push(week);
	}

	return weeks;
}

export function groupByWeeks(
	activities: Activity[],
	weekStart:
		| typeof WEEK_START_SUNDAY
		| typeof WEEK_START_MONDAY = WEEK_START_SUNDAY
): Array<Array<Activity | undefined>> {
	if (activities.length === 0) return [];

	const sortedActivities = [...activities].sort((a, b) =>
		a.date.localeCompare(b.date)
	);
	const firstActivity = sortedActivities[0];
	const lastActivity = sortedActivities[sortedActivities.length - 1];
	if (!firstActivity || !lastActivity) return [];

	const firstDate = new Date(firstActivity.date);
	const lastDate = new Date(lastActivity.date);

	const { start, end } = getWeekRange(firstDate, lastDate, weekStart);
	const activityMap = buildActivityMap(activities);

	return buildWeekGrid(start, end, activityMap);
}

export function getTotalCount(activities: Activity[]): number {
	return activities.reduce((sum, activity) => sum + activity.count, 0);
}
