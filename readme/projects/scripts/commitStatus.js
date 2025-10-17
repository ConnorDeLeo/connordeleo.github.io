/**
 * Inject latest commit dates into the "Status:" line of elements with data-repo.
 * Example markup:
 * <article data-user="ConnorDeLeo" data-repo="simplexMethodTI-84">
 *   <div class="footerline">Status: ✅ Active</div>
 * </article>
 */

async function fetchLatestCommit(user, repo) {
  const url = `https://api.github.com/repos/${user}/${repo}/commits?per_page=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const [commit] = await res.json();
    return new Date(commit.commit.author.date);
  } catch (err) {
    console.error(`Error fetching commit for ${user}/${repo}:`, err);
    return null;
  }
}

async function updateStatuses() {
  const cards = document.querySelectorAll('[data-repo]');
  for (const card of cards) {
    const user = card.dataset.user || 'ConnorDeLeo';
    const repo = card.dataset.repo;
    const date = await fetchLatestCommit(user, repo);
    if (!date) continue;

    const formatted = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const status = card.querySelector('.footerline');
    if (status) {
      // Option A: append after the existing text
      status.innerHTML += ` &nbsp;|&nbsp; Last commit: ${formatted}`;

      // Option B (if you want a newline instead):
      // status.innerHTML += `<br>Last commit: ${formatted}`;
    }
  }
}

document.addEventListener('DOMContentLoaded', updateStatuses);
