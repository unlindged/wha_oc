const listEl = document.getElementById('posts');
const postEl = document.getElementById('post');
let posts = [];

// The list of files comes from devlog/index.txt (written by the CI job).
// If that's missing (e.g. local preview), fall back to the server's directory listing.
async function listFiles() {
  try {
    const r = await fetch('devlog/index.txt');
    if (r.ok) {
      const files = (await r.text()).split('\n').map(s => s.trim()).filter(s => s.endsWith('.md'));
      if (files.length) return files;
    }
  } catch (e) { /* fall through to directory listing */ }
  const html = await (await fetch('devlog/')).text();
  return [...html.matchAll(/href="([^"]+\.md)"/g)]
    .map(m => decodeURIComponent(m[1]).split('/').pop());
}

async function loadPosts() {
  const files = (await listFiles()).sort().reverse();
  posts = await Promise.all(files.map(async file => {
    const text = await (await fetch('devlog/' + file)).text();
    const heading = text.match(/^#\s+(.+)$/m);
    const date = file.match(/^\d{4}-\d{2}-\d{2}/);
    return {
      file,
      text,
      date: date ? date[0] : '',
      title: heading ? heading[1] : file.replace(/\.md$/, ''),
    };
  }));
}

function render() {
  const file = decodeURIComponent(location.hash.replace(/^#\//, ''));
  const post = posts.find(p => p.file === file);
  listEl.hidden = !!post;
  postEl.hidden = !post;
  if (post) {
    postEl.innerHTML = marked.parse(post.text) +
      '<p class="back"><a href="#/">Back to all posts</a></p>';
    document.title = post.title;
    window.scrollTo(0, 0);
  } else {
    document.title = 'My Devlog';
    listEl.innerHTML = posts.length
      ? posts.map(p => `<li><a href="#/${encodeURIComponent(p.file)}">${p.title}</a>` +
          (p.date ? `<time>${p.date}</time>` : '') + '</li>').join('')
      : '<li>No posts yet. Add a .md file to the devlog folder.</li>';
  }
}

if (location.protocol === 'file:') {
  listEl.innerHTML = '<li>Browsers block loading files from disk. Run <code>python -m http.server</code> in this folder and open http://localhost:8000 instead.</li>';
} else {
  loadPosts().then(render).catch(err => {
    console.error(err);
    listEl.innerHTML = '<li>Could not load posts. Check the browser console for details.</li>';
  });
}
window.addEventListener('hashchange', render);
