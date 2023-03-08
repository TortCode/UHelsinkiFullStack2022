const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    const most_likes = (max_blog, blog) => {
        return (max_blog.likes < blog.likes)?blog:max_blog; 
    }
    return blogs.reduce(most_likes, {likes:0})
}

const maxEntry = (obj) => {
    const max = (max_entry, entry) => {
        return (max_entry[1] < entry[1]) ? entry : max_entry;
    }

    return Object.entries(obj).reduce(max, [null, 0]);
}

const mostBlogs = (blogsList) => {
    if (blogsList.length === 0) {
        return null;
    }

    const freq_map = {};
    blogsList.forEach( blog => {
        const freq = freq_map[blog.author] ?? 0;
        freq_map[blog.author] = freq + 1;
    })

    const [ author, blogs ] = maxEntry(freq_map);

    return { author, blogs };
}

const mostLikes = (blogsList) => {
    if (blogsList.length === 0) return null;

    const likes_map = {};
    blogsList.forEach(blog => {
        const total_likes = likes_map[blog.author] ?? 0;
        likes_map[blog.author] = total_likes + blog.likes;
    })

    const [ author, likes ] = maxEntry(likes_map); 
    return { author, likes };
}

module.exports = {
    mostLikes,
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}
