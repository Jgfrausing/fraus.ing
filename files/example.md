# My Markdown Content

This is some sample content written in Markdown.

- List item 1
- List item 2
- List item 3

<script>
  // This script dynamically processes and renders the Markdown content
  (function () {
    // Fetch the raw content of the file
    const content = document.documentElement.innerHTML;

    // Use a library like marked.js to convert Markdown to HTML
    const scriptTagIndex = content.lastIndexOf("</script>");

    const markdownContent = content.slice(0, scriptTagIndex).trim(); // Remove the script tag from content

    // Convert Markdown to HTML using marked.js (CDN required)
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.onload = () => {
      document.body.innerHTML = marked.parse(markdownContent);
    };
    document.head.appendChild(script);

})();
</script>
