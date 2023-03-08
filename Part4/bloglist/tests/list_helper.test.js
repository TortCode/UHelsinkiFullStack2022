const listHelper = require('../utils/list_helper')

test('dummy returns 1', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('when list has no blogs, equals 0', () => {
        expect(listHelper.totalLikes([])).toBe(0);
    })

    const multipleBlogList = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0
        },
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        },
        {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0
        },
        {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
            __v: 0
        },
        {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0
        }  
    ] 

    test('when list has multiple blogs, equals sums of likes', () => {
        expect(listHelper.totalLikes(multipleBlogList)).toBe(36);
    })
})

describe('favorite blog', () => {
    const singleBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ];

    const multipleBlogs = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0
        },
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        },
        {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0
        },
        {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
            __v: 0
        },
        {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0
        }  
    ];

    test('when list has zero blogs, is null', () => {
        expect(listHelper.favoriteBlog([])).toEqual(null);
    })

    test('when list has one blog, is the sole element', () => {
        expect(listHelper.favoriteBlog(singleBlog)).toEqual(singleBlog[0]);
    })

    test('when list has many blogs, is the first element with maximum likes', () => {
        expect(listHelper.favoriteBlog(multipleBlogs)).toEqual(multipleBlogs[2]); 
    })
})

describe('author with most blogs', () => {
    test('when there are no blogs, is null', () => {
        expect(listHelper.mostBlogs([])).toEqual(null);
    })

    test('when there is one common author, it is the sole author', () => {
        const blogs = [
            {author:"billy"},
            {author:"billy"},
            {author:"billy"}
        ]
        expect(listHelper.mostBlogs(blogs)).toEqual({author: "billy", blogs:3});
    })

    test('when there is multiple authors, give the author with most blogs', () => {
        const blogs = [
            {author:"billy"},
            {author:"joe"},
            {author:"joe"},
            {author:"joe"},
            {author:"billy"},
            {author:"billy"},
            {author:"billy"}
        ]
        expect(listHelper.mostBlogs(blogs)).toEqual({author:"billy", blogs:4});
    })
})

describe('author with most likes', () => {
    test('when there are no blogs, is null', () => {
        expect(listHelper.mostLikes([])).toEqual(null);
    })

    test('when there is one common author, it is the sole author', () => {
        const blogs = [
            {author:"billy", likes: 4},
            {author:"billy", likes: 5},
            {author:"billy", likes: 10}
        ]
        expect(listHelper.mostLikes(blogs)).toEqual({author: "billy", likes:19});
    })

    test('when there is multiple authors, give the author with most blogs', () => {
        const blogs = [
            {author:"billy", likes: 4},
            {author:"joe", likes: 5},
            {author:"joe", likes: 10},
            {author:"billy", likes: 10},
            {author:"pam", likes: 10},
            {author:"pam", likes: 6}
        ]
        expect(listHelper.mostLikes(blogs)).toEqual({author:"pam", likes:16});
    })
})
