const getSentenceFragment = (offset, callback) => {
    const pageSize = 3;
    const sentence = [...'hello world'];
    setTimeout(() => callback({
        data: sentence.slice(offset, offset + pageSize),
        nextPage: offset +
        pageSize < sentence.length ? offset + pageSize : undefined
    }), 100);
};

const getSentence = (offset, callback) => {
    getSentenceFragment(offset, (fragment) => {
        if (fragment.nextPage) {
            // recursively call getSentence
            getSentence(fragment.nextPage, (nextFragment) => {
                callback(fragment.data.concat(nextFragment))
            })
        } else {
            callback(fragment.data)
        }
    });
}

getSentence(0, (sentence) => console.log(sentence));