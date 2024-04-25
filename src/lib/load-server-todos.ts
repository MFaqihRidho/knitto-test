export async function loadServerTodos() {
    // Call an external API endpoint to get posts
    const res = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10&_page=1"
    );
    const data = await res.json();

    return data;
}
